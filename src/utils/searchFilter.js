import _ from "lodash";

/**
 * Function to handle filtering down search results based on title,
 * description text and search terms
 * @param {array} startingArray - initial Array that will be searched through
 * @param {string} watchInput - the input that is being watched for changes
 * @param {array} filteredResults - current filtered results
 * @param {function} setFilteredResults - function to set state of the new filtered results
 * @param {function} jumpToFirstPage - function to return the user to the first page when searching
 */
export default function searchFilter(
  startingArray,
  watchInput,
  filteredResults,
  setFilteredResults,
  jumpToFirstPage
) {
  let filteredArray = _.cloneDeep(startingArray);
  const searchInput = watchInput;
  filteredArray = _.filter(startingArray, (action) => {
    const optionName = (action?.name || action?.title || "").toLowerCase();
    const optionDescription = (action?.description || "").toLowerCase();
    const optionCategories = (
      _.get(action, "categoriesCollection.items") || []
    ).map((category) => {
      return (category?.name || "").toLowerCase();
    });
    const optionSubcategories = (
      _.get(action, "subcategoriesCollection.items") || []
    ).map((category) => {
      return (category?.name || "").toLowerCase();
    });
    const optionAppNames = (_.get(action, "appsCollection.items") || []).map(
      (category) => {
        return (category?.name || "").toLowerCase();
      }
    );
    const searchTerm = (searchInput || "").toLowerCase();
    // search through all passed in categories or sub categories or apps I guess to check if it has the search term
    const containsCategory = (categoryArray) => {
      const hasSearchTerm = _.compact(
        categoryArray.map((category) => {
          return category.includes(searchTerm);
        })
      );
      if (hasSearchTerm.length > 0) {
        return true;
      } else {
        return false;
      }
    };
    return (
      optionName.includes(searchTerm) ||
      optionDescription.includes(searchTerm) ||
      containsCategory(optionCategories) ||
      containsCategory(optionSubcategories) ||
      containsCategory(optionAppNames)
    );
  });
  // When displaying results, return to first page with new results being rendered
  if (_.xor(filteredArray, filteredResults).length > 0) {
    setFilteredResults(filteredArray);
    jumpToFirstPage();
    return filteredArray;
  }
  return null;
}
