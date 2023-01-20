import _ from "lodash";
import { gql } from "@apollo/client";
import { layoutQuery, navbarQuery, footerQuery } from "@graphql/layoutQuery";
import {
  appsCategoryQuery,
  appsTotalQuery,
  appsQuery,
} from "@graphql/appsServicesQuery";
import {
  partnersTotalQuery,
  partnersQuery,
  partnerDetailsGlobalQuery,
} from "@graphql/partnersQuery";
import {
  templatesCategoryQuery,
  templatesTotalQuery,
  templatesQuery,
} from "@graphql/templatesQuery";
import { pageQuery } from "@graphql/pageQuery";
import apolloClient from "@services/apolloClient";
import contentfulClient from "@services/contentfulClient";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";
import getAllCollectionItems from "@utils/getAllCollectionItems";

// Graphql call for get data with passed in variable of slug.
export const getAllData = gql`
  query pageQuery($slug: String!) {
    ${pageQuery}
    ${layoutQuery}
  }
`;

export const getNavbarData = gql`
  query navbarQuery($navbarSlug: String!) {
    ${navbarQuery}
  }
`;

export const getFooterData = gql`
  query footerQuery($footerSystemId: String!) {
    ${footerQuery}
  }
`;

export const getAppsInitialData = gql`
  query appsInitialQuery {
    ${appsCategoryQuery}
    ${appsTotalQuery}
  }
`;

export const getAppsData = gql`
  query appsQuery($skip: Int, $limit: Int) {
    ${appsQuery}
  }
`;

export const getTemplatesInitialData = gql`
  query templatesInitialQuery {
    ${templatesCategoryQuery}
    ${templatesTotalQuery}
  }
`;

export const getTemplatesData = gql`
  query templatesQuery($skip: Int, $limit: Int) {
    ${templatesQuery}
  }
`;

// ${partnersCategoryQuery}
export const getPartnersInitialData = gql`
  query partnersInitialQuery {
    ${partnersTotalQuery}
    ${partnerDetailsGlobalQuery}
  }
`;

export const getPartnersData = gql`
  query partnersQuery($skip: Int, $limit: Int) {
    ${partnersQuery}
  }
`;

// Get the contentful data of the app that contains the slug passed in & return props.
// https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/equality-operator/query-entries/console/js
export default async function getPageStaticProps(
  slug,
  loadAllTemplates = true
) {
  const { data } = await apolloClient.query({
    query: getAllData,
    variables: { slug },
  });

  const customNavbar = _.get(data, "pageCollection.items[0].customTopMenu");
  const customFooter = _.get(data, "pageCollection.items[0].customFooter");

  const getPage = await contentfulClient.getEntries({
    content_type: "page",
    include: 10,
    limit: 1,
    "sys.id": _.get(data, "pageCollection.items[0].sys.id"),
  });
  // PARSE APP SEARCH DATA IF PAGE HAS APP SEARCH
  const pageData = _.get(getPage, "items[0]");
  const seoFields = _.get(data, "pageCollection.items[0].seoFields");
  const sections = _.get(pageData, "fields.sections");
  const hasSearch = _.filter(sections, (section) => {
    return _.get(section, "sys.contentType.sys.id") === "pageAppSearchSection";
  });
  let categories,
    subcategories,
    total,
    apps,
    templates,
    partners,
    partnerDetailsGlobal,
    appTemplateArray;
  apps = null;
  templates = null;
  partners = null;
  partnerDetailsGlobal = null;
  categories = null;
  subcategories = null;
  appTemplateArray = null;
  if (hasSearch) {
    {
      const isApp = _.get(hasSearch[0], "fields.type") === "app";
      const isTemplate = _.get(hasSearch[0], "fields.type") === "template";
      const isPartner = _.get(hasSearch[0], "fields.type") === "partner";
      if (isApp) {
        const res = await apolloClient.query({
          query: getAppsInitialData,
        });
        // PARSE CATEGORIES & SUBCATEGORIES
        categories = concatUniqueSortArrays([
          _.filter(
            _.get(res, "data.appCategoryCollection.items") || [],
            (category) => {
              return !category.hide;
            }
          ),
        ]);
        subcategories = concatUniqueSortArrays(
          (categories || []).map((category) => {
            return _.get(category, "subcategoriesCollection.items") || [];
          })
        );
        // PARSE ALL APPS
        total = _.get(res, "data.appCollection.total");
        appTemplateArray = await getAllCollectionItems(
          total,
          getAppsData,
          "app",
          200
        );
      } else if (isTemplate) {
        const res = await apolloClient.query({
          query: getTemplatesInitialData,
        });
        // PARSE CATEGORIES & SUBCATEGORIES
        const initialCategories = concatUniqueSortArrays([
          _.filter(
            _.get(res, "data.appCategoryCollection.items") || [],
            (category) => {
              return !category.hide;
            }
          ),
        ]);
        categories = _.filter(initialCategories, (category) => {
          const subcategoriesWithItems = _.filter(
            _.get(category, "subcategoriesCollection.items") || [],
            (subcategory) => {
              return (
                (_.get(subcategory, "templatesCollection.items") || []).length >
                0
              );
            }
          );
          return subcategoriesWithItems.length > 0;
        });
        // PARSE SUBCATEGORIES
        const initialSubcategories = concatUniqueSortArrays(
          (categories || []).map((category) => {
            return _.get(category, "subcategoriesCollection.items") || [];
          })
        );
        subcategories = _.filter(initialSubcategories, (subcategory) => {
          return (
            (_.get(subcategory, "templatesCollection.items") || []).length > 0
          );
        });
        // PARSE ALL APPS
        total = _.get(res, "data.templateCollection.total");

        if (loadAllTemplates) {
          appTemplateArray = await getAllCollectionItems(
            total,
            getTemplatesData,
            "template",
            200
          );
        } else {
          appTemplateArray = [];
        }
      } else if (isPartner) {
        const res = await apolloClient.query({
          query: getPartnersInitialData,
        });
        // PARSE CATEGORIES & SUBCATEGORIES
        // categories = concatUniqueSortArrays([
        //   _.filter(
        //     _.get(res, "data.partnerCategoryCollection.items") || [],
        //     (category) => {
        //       return !category.hide;
        //     }
        //   ),
        // ]);
        // subcategories = concatUniqueSortArrays(
        //   (categories || []).map((category) => {
        //     return _.get(category, "subcategoriesCollection.items") || [];
        //   })
        // );
        // PARSE ALL APPS
        total = _.get(res, "data.partnerCollection.total");
        partnerDetailsGlobal = _.get(
          res,
          "data.partnerDetailsGlobalCollection.items[0]"
        );

        appTemplateArray = await getAllCollectionItems(
          total,
          getPartnersData,
          "partner",
          200
        );
      }
      // the shorthand for priority needs to be expanded to cover null cases
      // in order for descending order to work properly (no null before max)
      const sortedArray = _.orderBy(
        concatUniqueSortArrays([appTemplateArray]),
        (appTemplate) => {
          return appTemplate.priority || appTemplate.score || "";
        },
        "desc"
      );
      if (isTemplate) {
        templates = sortedArray;
        apps = null;
        partners = null;
      } else if (isPartner) {
        partners = sortedArray;
        apps = null;
        templates = null;
      } else {
        apps = sortedArray;
        partners = null;
        templates = null;
      }
    }
  }

  let navbarBaseData = _.get(data, "navbarCollection.items[0]");
  if (customNavbar && customNavbar.slug) {
    const navbarRes = await apolloClient.query({
      query: getNavbarData,
      variables: { navbarSlug: customNavbar.slug },
    });

    if (navbarRes.data) {
      navbarBaseData = _.get(navbarRes.data, "navbarCollection.items[0]");
    }
  }

  // PARSE LAYOUT DATA INCLUDING OPTIONAL OVERRIDES FOR SIGN IN LINKS
  const signInLinks = _.get(pageData, "fields.signInLinks") || null;
  const navbarData = {
    ...navbarBaseData,
    signInLinks,
  };
  // PARSE SEO CONFIG DATA
  const seoConfigData = _.get(data, "seoConfigCollection.items[0]");
  // PARSE OPTIONAL OVERRIDES FOR FOOTER CTA
  let initialFooterData = _.get(data, "footerCollection.items[0]");

  if (customFooter && customFooter.systemId) {
    const footerRes = await apolloClient.query({
      query: getFooterData,
      variables: { footerSystemId: customFooter.systemId },
    });

    if (footerRes.data) {
      initialFooterData = _.get(footerRes.data, "footerCollection.items[0]");
    }
  }

  const ctaTitle = _.get(pageData, "fields.ctaTitle");
  const ctaDescription = _.get(pageData, "fields.ctaDescription");
  const ctaLink = _.get(pageData, "fields.ctaLink");
  const footerData = {
    ...initialFooterData,
    ctaTitle: ctaTitle || _.get(initialFooterData, "ctaTitle"),
    ctaDescription:
      ctaDescription || _.get(initialFooterData, "ctaDescription"),
    ctaLink: ctaLink || _.get(initialFooterData, "ctaLink"),
  };
  const darkNav =
    _.get(pageData, "fields.sections[0].fields.backgroundColor") ===
      "dark mode" ||
    _.get(pageData, "fields.sections[0].fields.backgroundColor") ===
      "dark hero mode" ||
    false;

  return {
    props: {
      pageData,
      apps,
      templates,
      partners,
      partnerDetailsGlobal,
      categories,
      subcategories,
      seoFields,
      navbarData,
      seoConfigData,
      footerData,
      darkNav,
      total: total || 0,
    },
    revalidate: 259200,
  };
}
