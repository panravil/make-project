// https://www.npmjs.com/package/next-sitemap
import { getServerSideSitemap } from "next-sitemap";
import _ from "lodash";
import { gql } from "@apollo/client";
import { appsTotalQuery, allAppSlugsQuery } from "@graphql/appDetailsQuery";
import apolloClient from "@services/apolloClient";
import getAllCollectionItems from "@utils/getAllCollectionItems";

// Graphql call for getting all apps total count.
export const getAllPathsTotal = gql`
  query allAppSlugsTotalQuery {
    ${appsTotalQuery}
  }
`;

// Graphql call for getting all apps slugs.
export const getAllPaths = gql`
  query allAppSlugsQuery($skip: Int, $limit: Int) {
    ${allAppSlugsQuery}
  }
`;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
export const getServerSideProps = async (ctx) => {
  const { data } = await apolloClient.query({
    query: getAllPathsTotal,
  });
  const total = _.get(data, "totalCollection.total");
  const appsArray = await getAllCollectionItems(
    total,
    getAllPaths,
    "app",
    1000
  );
  const fields = appsArray.map((app) => {
    return {
      loc: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/en/integrations/${app?.slug}`,
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
