// https://www.npmjs.com/package/next-sitemap
import { getServerSideSitemap } from "next-sitemap";
import _ from "lodash";
import { gql } from "@apollo/client";
import {
  partnersTotalQuery,
  allPartnerSlugsQuery,
} from "@graphql/partnersQuery";
import apolloClient from "@services/apolloClient";
import getAllCollectionItems from "@utils/getAllCollectionItems";

// Graphql call for getting total count.
export const getAllPathsTotal = gql`
  query allPartnerSlugsTotalQuery {
    ${partnersTotalQuery}
  }
`;

// Graphql call for getting slugs.
export const getAllPaths = gql`
    query partnersQuery($skip: Int, $limit: Int) {
      ${allPartnerSlugsQuery}
    }
`;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
export const getServerSideProps = async (ctx) => {
  const { data } = await apolloClient.query({
    query: getAllPathsTotal,
  });
  const total = _.get(data, "partnerCollection.total");
  const partnersArray = await getAllCollectionItems(
    total,
    getAllPaths,
    "partner",
    1000
  );
  const fields = partnersArray.map((app) => {
    return {
      loc: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/en/partners-directory/${app?.slug}`,
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
