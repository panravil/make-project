import _ from "lodash";

/**
 * Function to replace wildcard text from contentful with the correct information
 * @param {string} startingString - initial string that needs details replaced
 * @param {array} nameArray - Name of app to replace in the string
 * @param {string} description - description that could need details replaced
 */
export default function replaceDetailsWildCard(
  startingString,
  nameArray,
  description
) {
  let newString;
  // This standardizes the name array to be able to accept a single name
  // or an array of names for flexibility & to ensure consistent returns
  const stringArray = _.uniq(_.compact(_.flatten([nameArray])));
  if (startingString) {
    if (stringArray.length > 0) {
      newString = _.replace(
        startingString,
        new RegExp("{name}", "g"),
        `${_.join(stringArray, " and ")}`
      );
    } else {
      newString = startingString;
    }
  }
  if (description) {
    newString = _.replace(
      newString,
      new RegExp("{description}", "g"),
      description
    );
  }
  return newString;
}
