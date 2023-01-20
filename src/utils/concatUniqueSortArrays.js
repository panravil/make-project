import _ from "lodash";

/**
 * Function to combine arrays, filter out duplicates and sort the response.
 * @param {array} arrays - The arrays to be parsed, must be passed in as an array for this to handle all cases.
 * @param {string} uniqBy - Filter unique by a param, default slug.
 * @param {string} sortBy - Sort by a param, default name.
 * @param {string} sortBy - Order by a param, default asc.
 */
export default function concatUniqueSortArrays(
  arrays = [],
  uniqBy = "slug",
  sortBy = "name",
  order = "asc"
) {
  if (arrays.length > 1) {
    return _.orderBy(
      _.uniqBy(
        _.compact(
          _.flatten(
            _.concat(
              arrays.map((array) => {
                return array;
              })
            )
          )
        ),
        uniqBy
      ),
      sortBy,
      order
    );
  } else if (arrays.length > 0) {
    return _.orderBy(_.uniqBy(arrays[0], uniqBy), sortBy, order);
  } else {
    return [];
  }
}
