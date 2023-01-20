import _ from "lodash";
import apolloClient from "@services/apolloClient";

/**
 * paginated call for all apps or templates
 * query for total in collection before using this
 * pass in the query defined with ($skip: Int, $limit: Int)
 * Pass in the string "template" to get templateCollection, default "app"
 * @param {number} total - The total number of items, determines how many times the paginated calls happen.
 * @param {string} query - Graphql query, must line up with collection string definition.
 * @param {string} collectionString - Items to assit the grabbing of items, must line up with graphql query.
 * @param {number} limit - Limit number of items, important to avoid complexity 400 errors.
 * @param {object} customVariables
 */
export default async function getAllCollectionItems(
  total,
  query,
  collectionString = "app",
  limit = 200,
  customVariables = {}
) {
  let appsArray = [];
  for (let skip = 0; skip < total; skip += limit) {
    const res = await apolloClient.query({
      query,
      variables: {
        ...customVariables,
        ...{
          skip,
          limit,
        },
      },
    });
    appsArray.push(_.get(res, `data.${collectionString}Collection.items`));
    appsArray = _.flatten(appsArray);
  }
  return appsArray;
}
