import _ from "lodash";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";
import { gql } from "@apollo/client";
import { templatesByAppQuery, templatesByIds } from "@graphql/templatesQuery";
import apolloClient from "@services/apolloClient";
import contentfulClient from "@services/contentfulClient";

/**
 * Function to return the templates collection from an app that was provided
 * @param {object} res - The initial App from which the templates are parsed from
 */
function getTemplatesFromApp(res) {
  return _.get(res, "data.appCollection.items[0].templatesCollection.items");
}

const getTemplatesQuery = gql`
  query appTemplatesQuery($slug: String!, $templateLimit: Int) {
    ${templatesByAppQuery}
  }
`;

const getTemplatesByIdsQuery = gql`
  query appTemplatesQuery($ids: [String]!, $templateLimit: Int) {
    ${templatesByIds}
  }
`;

async function getTemplatesByApp(slug, limit) {
  if (!slug) {
    return [];
  }
  let res;
  if (Array.isArray(slug)) {
    let apiTemplates = {
      items: [],
    };

    try {
      apiTemplates = await contentfulClient.getEntries({
        content_type: "template",
        include: 1,
        limit: 100,
        "fields.apps.sys.id[all]": slug
          .map((item) => {
            return `app-${item}`;
          })
          .join(","),
        select: "sys.id",
      });
    } catch (e) {
      console.warn(e);
    }

    const templateIds = [];
    if (apiTemplates?.items?.length) {
      for (let i = 0; i < apiTemplates?.items?.length; i++) {
        templateIds.push(apiTemplates.items[i].sys.id);
        //Do something
      }
    }

    if (templateIds.length) {
      res = await apolloClient.query({
        query: getTemplatesByIdsQuery,
        variables: { ids: templateIds, templateLimit: limit },
      });
    }

    return res?.data?.templateCollection?.items || [];
  } else {
    res = await apolloClient.query({
      query: getTemplatesQuery,
      variables: { slug, templateLimit: limit },
    });
  }

  return (
    res?.data?.appCollection?.items[0]?.linkedFrom?.templateCollection?.items ||
    []
  );
}

/**
 * Function that returns similar apps based on category
 * @param {*} res - The initial App from which the categories are paresed to find similar apps
 */
function getSimilarApps(res) {
  const appSubcategoryCollection =
    _.get(res, "data.appCollection.items[0].subcategoriesCollection.items") ||
    [];
  const similarApps = concatUniqueSortArrays(
    appSubcategoryCollection.map((subcategory) => {
      return _.get(subcategory, "appsCollection.items") || [];
    })
  );
  return similarApps;
}

export { getTemplatesFromApp, getSimilarApps, getTemplatesByApp };
