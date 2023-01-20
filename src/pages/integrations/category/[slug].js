import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import {
  allAppCategorySlugsQuery,
  singleAppCategory,
  singleAppSubcategory,
} from "@graphql/appsServicesQuery";
import apolloClient from "@services/apolloClient";
import getPageStaticProps from "@utils/getPageStaticProps";
import renderPageSections from "@utils/renderPageSections";
import replaceSeoWildCard from "@utils/replaceSeoWildCard";
import { Layout, SeoFields } from "@components/common";

const propTypes = {
  pageData: PropTypes.object.isRequired,
  seoFields: PropTypes.object.isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
};

export default function AppsCategoryPage({
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
}) {
  const sections = _.get(pageData, "fields.sections") || [];
  const canonicalUrl = _.get(seoConfigData, "canonicalUrl");
  const pageSlug = _.get(pageData, "fields.slug");
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
        templates,
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

AppsCategoryPage.propTypes = propTypes;

AppsCategoryPage.Layout = Layout;

// Graphql call for getting all app slugs.
export const getCategorySlugPaths = gql`
  query allAppCategorySlugsQuery($skip: Int, $limit: Int) {
    ${allAppCategorySlugsQuery}
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
  const { data } = await apolloClient.query({
    query: getCategorySlugPaths,
    variables: {
      skip: 0,
      limit: 1,
    },
  });
  const appsArray = _.get(data, "appCategoryCollection.items");
  return {
    paths: appsArray.map((category) => {
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
  const staticProps = await getPageStaticProps("integrations");
  staticProps.props.currentCategory = appCategory;
  return staticProps;
}
