// https://www.npmjs.com/package/next-sitemap
import { getServerSideSitemap } from "next-sitemap";
import _ from "lodash";
import { gql } from "@apollo/client";
import { blogsTotalQuery, allBlogSlugsQuery } from "@graphql/blogIndexQuery";
import apolloClient from "@services/apolloClient";
import getAllCollectionItems from "@utils/getAllCollectionItems";
import blogCategoriesHasUseCase from "@utils/blogCategoriesHasUseCase";

// Graphql call for getting total count.
export const getAllPathsTotal = gql`
  query allBlogSlugsTotalQuery {
    ${blogsTotalQuery}
  }
`;

// Graphql call for getting slugs.
export const getAllPaths = gql`
    query blogsQuery($skip: Int, $limit: Int) {
      ${allBlogSlugsQuery}
    }
`;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
export const getServerSideProps = async (ctx) => {
  const { data } = await apolloClient.query({
    query: getAllPathsTotal,
  });
  const total = _.get(data, "totalCollection.total");
  const allBlogsRaw = await getAllCollectionItems(
    total,
    getAllPaths,
    "blog",
    500
  );
  const blogsArray = _.filter(allBlogsRaw, (blog) => {
    const hasUseCaseCategory = blogCategoriesHasUseCase(blog);
    // DEVIATION BETWEEN BLOG & USE CASES
    if (hasUseCaseCategory) {
      return false;
    } else {
      return true;
    }
  });
  const fields = blogsArray.map((app) => {
    return {
      loc: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.make.com"
      }/en/blog/${app?.slug}`,
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
