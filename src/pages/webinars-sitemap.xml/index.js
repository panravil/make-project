// https://www.npmjs.com/package/next-sitemap
import { getServerSideSitemap } from "next-sitemap";
import _ from "lodash";
import { gql } from "@apollo/client";
import {
  webinarsTotalQuery,
  allWebinarSlugsQuery,
} from "@graphql/webinarIndexQuery";
import apolloClient from "@services/apolloClient";
import getAllCollectionItems from "@utils/getAllCollectionItems";

// Graphql call for getting total count.
export const getAllPathsTotal = gql`
  query allWebinarsSlugsTotalQuery {
    ${webinarsTotalQuery}
  }
`;

// Graphql call for getting slugs.
export const getAllPaths = gql`
    query webinarsQuery($skip: Int, $limit: Int) {
      ${allWebinarSlugsQuery}
    }
`;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
export const getServerSideProps = async (ctx) => {
  const { data } = await apolloClient.query({
    query: getAllPathsTotal,
  });
  const total = _.get(data, "totalCollection.total");
  const allWebinarsRaw = await getAllCollectionItems(
    total,
    getAllPaths,
    "webinar",
    500
  );
  const fields = allWebinarsRaw.map((app) => {
    return {
      loc: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/en/webinars/${app?.slug}`,
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
