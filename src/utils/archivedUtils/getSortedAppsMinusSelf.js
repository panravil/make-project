import _ from "lodash";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";

/**
 * This is not being used at this time
 *
 *  Function to sort apps but removes the starting app from the response
 * @param {object} initialApp - Starting app to know what to filter out
 * @param {array} appsArray - Array of apps to combine similar apps and filter initial app out
 * @param {object} initialApp2 - Second Starting app to know a second app to filter out
 * @param {array} appsArray2 - Second array of apps to combine and remove the initial apps out of
 * @returns
 */
function getSortedAppsMinusSelf(
  initialApp,
  appsArray,
  initialApp2,
  appsArray2
) {
  const combinedAppsArray = concatUniqueSortArrays([appsArray, appsArray2]);
  return _.filter(combinedAppsArray, (item) => {
    const isNotFirstApp = item?.slug !== initialApp?.slug;
    const isNotSecondApp = item?.slug !== initialApp2?.slug;
    return isNotFirstApp && isNotSecondApp;
  });
}

export { getSortedAppsMinusSelf };
