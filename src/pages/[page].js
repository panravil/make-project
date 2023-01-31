import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { allPageSlugsQuery } from "@graphql/pageQuery";
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

// Graphql call for getting all app slugs.
export const getAllPagePaths = gql`
  query allPageSlugsQuery {
    ${allPageSlugsQuery}
  }
`;

// Get the slugs of all apps in contentful & pass as a param to get static props.
export async function getStaticPaths() {
  const { data } = await apolloClient.query({ query: getAllPagePaths });
  const items = _.get(data, "pageCollection.items");

  const exclude = [
    "careers-detail",
    "platform-ideas",
    "app-ideas",
    "app-improvement-ideas",
  ];

  const paths = items
    .map((page) => {
      return { params: { page: page?.slug }, locale: "en" };
    })
    .filter((item) => {
      return !exclude.includes(item?.params?.page);
    });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { page } = params;
  const staticProps = await getPageStaticProps(page);
  return staticProps;
}
