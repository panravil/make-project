import _ from "lodash";

/**
 * Function to replace wildcard text from contentful with the correct information
 * @param {string} string - String that comes from contentful that needs information replaced
 * @param {number} int - new number to be added to string
 */
export default function replaceRangeWildCard(string, int) {
  if (int) {
    const rangeString = _.replace(
      string,
      new RegExp("{range}", "g"),
      `${Math.floor(int / 1000) * 1000}`
    );
    const countString = _.replace(
      rangeString,
      new RegExp("{count}", "g"),
      `${int}`
    );

    return countString;
  } else {
    return string;
  }
}
