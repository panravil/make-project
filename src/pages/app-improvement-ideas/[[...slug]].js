import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { singlePageSlugsQuery } from "@graphql/pageQuery";
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

const currentPageSlug = "app-improvement-ideas";

export default function Page({
  pageData,
  apps,
  templates,
  partners,
  categories,
  partnerDetailsGlobal,
  subcategories,
  seoFields,
  seoConfigData,
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
      />
      {renderPageSections(
        sections,
        apps,
        templates,
        categories,
        subcategories,
        partners,
        partnerDetailsGlobal,
        pageData
      )}
    </>
  );
}

Page.propTypes = propTypes;

Page.Layout = Layout;

export const getPath = gql`
  query allPageSlugsQuery($slug: String) {
    ${singlePageSlugsQuery}
  }
`;

// Get the slugs of all apps in contentful & pass as a param to get static props.
export async function getStaticPaths() {
  const { data } = await apolloClient.query({
    query: getPath,
    variables: {
      slug: currentPageSlug,
    },
  });
  const pagesArray = _.get(data, "pageCollection.items");

  return {
    paths: pagesArray.map((page) => {
      return { params: { slug: [page?.slug] }, locale: "en" };
    }),
    fallback: "blocking",
  };
}

// Get the contentful data of the app that contains the slug passed in & return props.
// export async function getStaticProps({ params }) {
export async function getStaticProps({ params }) {
  const staticProps = await getPageStaticProps(currentPageSlug);

  return staticProps;
}
