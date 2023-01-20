import _ from "lodash";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";

/**
 * Function that combines Categories and Sub Categories to be one array.
 * @param {object} appTemplate - The app or template from which categories are parsed from.
 * @param {boolean} nameOnly - If true, return only the name, otherwise return entire object in array.
 */
export default function combineCategoriesSubcategories(appTemplate, nameOnly) {
  if (appTemplate) {
    // Save each category on the app in an array
    const categories = _.map(
      _.get(appTemplate, "categoriesCollection.items"),
      (category) => {
        return category;
      }
    );
    // Save each subcategory on the app in an array
    const subcategories = _.map(
      _.get(appTemplate, "subcategoriesCollection.items"),
      (subcategory) => {
        return subcategory;
      }
    );
    // Combine categories and subcategories into an array and remove duplicates
    const combinedArray = concatUniqueSortArrays([categories, subcategories]);
    if (nameOnly) {
      // if nameOnly, return just the names of the items
      const combinedNameArray = _.map(combinedArray, (item) => {
        return item.name;
      });
      return combinedNameArray;
    }
    // or return the whole array of app
    return combinedArray;
  } else {
    return [];
  }
}
