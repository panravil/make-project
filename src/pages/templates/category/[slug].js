import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import {
  allAppCategorySlugsQuery,
  allAppSubcategorySlugsQuery,
  singleAppCategory,
  singleAppSubcategory,
} from "@graphql/appsServicesQuery";
import apolloClient from "@services/apolloClient";
import getPageStaticProps, {
  getTemplatesData,
} from "@utils/getPageStaticProps";
import renderPageSections from "@utils/renderPageSections";
import replaceSeoWildCard from "@utils/replaceSeoWildCard";
import { Layout, SeoFields } from "@components/common";
import { useEffect, useState } from "react";
import getAllCollectionItems from "@utils/getAllCollectionItems";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";

const propTypes = {
  pageData: PropTypes.object.isRequired,
  seoFields: PropTypes.object.isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
};

const dataCached = null;

export default function TemplateCategoryPage({
  pageData,
  apps,
  templates,
  partners,
  categories,
  partnerDetailsGlobal,
  subcategories,
  seoFields,
  seoConfigData,
  currentCategory,
  total,
}) {
  const sections = _.get(pageData, "fields.sections") || [];
  const canonicalUrl = _.get(seoConfigData, "canonicalUrl");
  const pageSlug = _.get(pageData, "fields.slug");
  /*const [templatesToRender, setTemplatesToRender] = useState(templates);*/

  /*useEffect(async () => {

    const appTemplateArray = await getAllCollectionItems(
      total,
      getTemplatesData,
      "template",
      200,
      {},
      true
    );

    const sortedArray = _.orderBy(
      concatUniqueSortArrays([appTemplateArray]),
      (appTemplate) => {
        return appTemplate.priority || appTemplate.score || "";
      },
      "desc"
    );

    setTemplatesToRender(sortedArray);
  }, []);*/

  return (
    <>
      <SeoFields
        seoFields={
          apps?.length
            ? replaceSeoWildCard(seoFields, apps.length)
            : templates?.length
            ? replaceSeoWildCard(seoFields, templates.length)
            : seoFields
        }
        canonical={`${canonicalUrl}/${pageSlug}`}
        noindex={seoFields?.noindex}
        nofollow={seoFields?.noindex}
        prependTitle={`${currentCategory.name} | `}
      />
      {renderPageSections(
        sections,
        apps,
        templates /*templatesToRender*/,
        categories,
        subcategories,
        partners,
        partnerDetailsGlobal,
        pageData,
        currentCategory
      )}
    </>
  );
}

TemplateCategoryPage.propTypes = propTypes;

TemplateCategoryPage.Layout = Layout;

// Graphql call for getting all app slugs.
export const getCategorySlugPaths = gql`
  query allAppCategorySlugsQuery($skip: Int, $limit: Int) {
    ${allAppCategorySlugsQuery}
  }
`;

export const getSubcategorySlugPaths = gql`
  query allAppSubcategorySlugsQuery($skip: Int, $limit: Int) {
    ${allAppSubcategorySlugsQuery}
  }
`;

export const getSingleCategory = gql`
  query singleAppCategoryQuery($slug: String!) {
    ${singleAppCategory}
  }
`;

export const getSingleSubcategory = gql`
  query singleAppSubcategoryQuery($slug: String!) {
    ${singleAppSubcategory}
  }
`;

export async function getStaticPaths() {
  const res1 = await apolloClient.query({
    query: getCategorySlugPaths,
    variables: {
      skip: 0,
      limit: 1,
    },
  });
  const res2 = await apolloClient.query({
    query: getSubcategorySlugPaths,
    variables: {
      skip: 0,
      limit: 1,
    },
  });
  const appsCategoriesArray = _.get(res1.data, "appCategoryCollection.items");
  const appsSubcategoriesArray = _.get(
    res2.data,
    "appSubcategoryCollection.items"
  );

  const allcategories = _.union(appsCategoriesArray, appsSubcategoriesArray);

  return {
    paths: allcategories.map((category) => {
      return { params: { slug: category?.slug }, locale: "en" };
    }),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { data } = await apolloClient.query({
    query: getSingleCategory,
    variables: {
      slug,
    },
  });

  let categoryData = _.get(data, "appCategoryCollection.items[0]");

  if (!categoryData) {
    const { data } = await apolloClient.query({
      query: getSingleSubcategory,
      variables: {
        slug,
      },
    });

    categoryData = _.get(data, "appSubcategoryCollection.items[0]");
  }

  if (!categoryData) {
    return {
      notFound: true,
    };
  }

  const appCategory = _.clone(categoryData);
  appCategory.type = "categories";

  /*let staticProps;
  if (dataCached) {
    staticProps = dataCached;
  } else {
    staticProps = await getPageStaticProps("templates"/!*, false*!/);
  }*/

  const staticProps = await getPageStaticProps("templates" /*, false*/);
  staticProps.props.currentCategory = appCategory;

  return staticProps;
}
