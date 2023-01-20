import _ from "lodash";
import replaceDetailsWildCard from "./replaceDetailsWildCard";
import replaceRangeWildCard from "./replaceRangeWildCard";

/**
 * Function to replace wildcard text from contentful with the correct information
 * @param {*} seoFields -Fields in the SEO that need to be replaced
 * @param {*} count - new number that will be inserted into SEO fields
 * @param {*} nameArray - new Name that will be added to the SEO fields
 * @param {*} description - new description that will be added to the SEO fields
 */
export default function replaceSeoWildCard(
  seoFields,
  count,
  nameArray,
  description
) {
  const newSeoFields = _.cloneDeep(seoFields);
  if (seoFields?.title) {
    newSeoFields.title = replaceDetailsWildCard(
      replaceRangeWildCard(seoFields.title, count),
      nameArray,
      description
    );
  }
  if (seoFields?.description) {
    newSeoFields.description = replaceDetailsWildCard(
      replaceRangeWildCard(seoFields.description, count),
      nameArray,
      description
    );
  }
  return newSeoFields;
}
