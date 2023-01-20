// https://www.npmjs.com/package/next-sitemap
import { getServerSideSitemap } from "next-sitemap";
// import { GetServerSideProps } from "next";
import _ from "lodash";
import { gql } from "@apollo/client";
import {
  templatesTotalQuery,
  allTemplateSlugsQuery,
} from "@graphql/templateDetailsQuery";
import apolloClient from "@services/apolloClient";
import getAllCollectionItems from "@utils/getAllCollectionItems";

// Graphql call for getting all templates total count.
export const getAllPathsTotal = gql`
  query allTemplateSlugsTotalQuery {
    ${templatesTotalQuery}
  }
`;

// Graphql call for getting all templates slugs.
export const getAllPaths = gql`
  query allTemplateSlugsQuery($skip: Int, $limit: Int) {
    ${allTemplateSlugsQuery}
  }
`;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
export const getServerSideProps = async (ctx) => {
  const { data } = await apolloClient.query({
    query: getAllPathsTotal,
  });
  const total = _.get(data, "totalCollection.total");
  const templatesArray = await getAllCollectionItems(
    total,
    getAllPaths,
    "template",
    1000
  );
  const fields = templatesArray.map((template) => {
    return {
      loc: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/en/templates/${template?.slug}`,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  });
  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
const Sitemap = () => {};
export default Sitemap;
