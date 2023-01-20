import {
  filter,
  get,
  isArray,
  isEmpty,
  isNumber,
  map,
  pull,
  set,
  slice,
  unset,
  cloneDeep,
} from "lodash";

// this is a piece of the error message to match on that you get back as a Contentful unresolved error.
// adapt this matcher to your own setup depending on how strict it should be (e.g. when you might have other API's with similar errors).
const CONTENT_UNRESOLVED_MATCHER = "cannot be resolved";

/**
 * Based on GraphQL errors from contentful we can automatically filter out unresolved links
 * across the response and resolve the errors in our own middleware so the client is not dealing with it.
 */
export function filterUnresolved(response) {
  const mutatableResponse = cloneDeep(response);
  const { errors, data } = mutatableResponse;
  const regex = new RegExp(CONTENT_UNRESOLVED_MATCHER);
  const unresolvedErrors = filter(errors, (error) => {
    const { message } = error;
    return regex.test(message);
  });
  const potentialUnresolvedPaths = [];

  // guard: skip filtering when there are no unresolved errors
  if (isEmpty(unresolvedErrors)) {
    return mutatableResponse;
  }

  map(unresolvedErrors, (error) => {
    // cast to non-read only
    const path = error.path;

    // guard: skip invalid paths
    if (!path) {
      return;
    }

    // by default we remove the unresolved content from the path completely
    unset(data, path);

    // add the path to be removed entirely later on
    potentialUnresolvedPaths.push(path);

    // register the parent path when it is an array to remove null entries later
    if (isNumber(path?.[path?.length - 1])) {
      potentialUnresolvedPaths.push(slice(path, 0, path.length - 1));
    }

    // if all is good we will delete the error as well
    pull(errors, error);
  });

  // strip out all the potential nulls that exist while filtering.
  // this is done afterwards, because some paths contain indexes and if you
  // mutate directly all the indexes will shift, causing the wrong data to be removed.
  map(potentialUnresolvedPaths, (path) => {
    const entry = get(data, path);

    if (isArray(entry)) {
      const filteredList = filter(entry, (entryPiece) => {
        // filter out nulls and undefined from a list
        // NOTE: if you expect nullable objects this will mess some things up!
        return entryPiece ?? false;
      });

      set(data, path, filteredList);
    }
  });

  return mutatableResponse;
}
