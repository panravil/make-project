import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import {
  blogsTotalQuery,
  blogIndexQuery,
  allBlogsQuery,
  blogFooterQuery,
} from "@graphql/blogIndexQuery";
import apolloClient from "@services/apolloClient";
import getAllCollectionItems from "@utils/getAllCollectionItems";
import blogCategoriesHasUseCase from "@utils/blogCategoriesHasUseCase";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";

import { Layout, SeoFields } from "@components/common";
import {
  FeaturedBlog,
  BlogSearch,
  PopularBlogs,
  BlogFooter,
} from "@components/blogPages";
import {
  PageSectionWrapper,
  // PageImageSection
} from "@components/page";

const propTypes = {
  blogIndexData: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
  allBlogs: PropTypes.arrayOf(
    PropTypes.shape({
      featuredBlog: PropTypes.bool,
    })
  ).isRequired,
  blogFooterData: PropTypes.object.isRequired,
  footerData: PropTypes.shape({
    subscribeModalText: PropTypes.string.isRequired,
  }).isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
  seoFields: PropTypes.object,
};

// TODO: USE CASES (PLURAL)
// AllBlogs page component
export default function AllBlogs({
  blogIndexData,
  allBlogs,
  categories,
  topics,
  blogFooterData,
  footerData,
  seoConfigData,
  seoFields,
}) {
  // const featuredBlog = _.find(allBlogs, (blog) => blog.featured === true);
  const featuredBlog = _.get(blogIndexData, "featuredArticle");
  const thanksForSubscribingText = _.get(footerData, "subscribeModalText");
  // const featuredBlogFields = {
  //   subtitle: _.get(blogIndexData, "featuredTitle"),
  //   title: _.get(featuredBlog, "title"),
  //   description: _.get(featuredBlog, "description"),
  //   link: {
  //     name: _.get(blogIndexData, "featuredLinkText"),
  //     slug: _.get(featuredBlog, "slug"),
  //   },
  //   imagesCollection: {
  //     items: [_.get(featuredBlog, "image")],
  //   },
  //   imageLeft: true,
  //   backgroundColor: "grey to white",
  // };

  return (
    <>
      <SeoFields
        seoFields={seoFields}
        canonical={`${seoConfigData?.canonicalUrl}/use-cases`}
      />
      <PageSectionWrapper
        fields={{
          backgroundColor: "grey to white",
          prevDark: false,
          nextDark: false,
        }}
        index={0}
        sections={[0, 1, 2, 3]}
      >
        {featuredBlog ? (
          <FeaturedBlog
            blogIndexData={blogIndexData}
            featuredBlog={featuredBlog}
            useCase
          />
        ) : null}
      </PageSectionWrapper>
      {/*featuredBlog ? <PageImageSection fields={featuredBlogFields} /> : null*/}
      <PageSectionWrapper
        fields={{
          backgroundColor: "white",
          prevDark: false,
          nextDark: false,
        }}
        index={1}
        sections={[0, 1, 2, 3]}
      >
        <BlogSearch
          blogIndexData={blogIndexData}
          allBlogs={allBlogs}
          categories={categories}
          topics={topics}
          useCase
        />
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor: "white to grey to grey",
          prevDark: false,
          nextDark: false,
        }}
        index={2}
        sections={[0, 1, 2, 3]}
      >
        <PopularBlogs
          blogIndexData={blogIndexData}
          allBlogs={allBlogs}
          useCase
        />
      </PageSectionWrapper>
      <BlogFooter
        blogFooterData={blogFooterData}
        thanksForSubscribingText={thanksForSubscribingText}
        fields={{
          backgroundColor: "grey",
          prevDark: false,
          nextDark: true,
        }}
        index={3}
        sections={[0, 1, 2, 3]}
      />
    </>
  );
}

AllBlogs.propTypes = propTypes;

AllBlogs.Layout = Layout;

// Graphql call for get data with passed in variable of slug.
export const getPageData = gql`
  query blogIndexLayoutQuery($indexSlug: String!) {
    ${layoutQuery}
    ${blogIndexQuery}
    ${blogsTotalQuery}
    ${blogFooterQuery}
  }
`;

export const getBlogsData = gql`
    query blogsQuery($skip: Int, $limit: Int) {
      ${allBlogsQuery}
    }
  `;

export async function getStaticProps() {
  const { data } = await apolloClient.query({
    query: getPageData,
    variables: { indexSlug: "use-case" },
  });
  // PARSE PAGE DATA
  // const allBlogs = _.get(data, "allBlogsDetails.items");
  const blogIndexData = _.get(data, "blogIndexPageCollection.items[0]");
  const blogFooterData = _.get(data, "blogFooter.items[0]");
  const seoFields = _.get(data, "blogIndexPageCollection.items[0].seoFields");

  // PARSE BLOGS
  const total = _.get(data, "totalCollection.total");
  const allBlogsRaw = await getAllCollectionItems(
    total,
    getBlogsData,
    "blog",
    400
  );
  const allBlogs = _.filter(allBlogsRaw, (blog) => {
    const hasUseCaseCategory = blogCategoriesHasUseCase(blog);
    // DEVIATION BETWEEN BLOG & USE CASES
    if (hasUseCaseCategory) {
      return true;
    } else {
      return false;
    }
  });
  // PARSE CATEGORIES FROM FILTERED BLOGS OR USE CASES
  const initialCategories = concatUniqueSortArrays(
    allBlogs.map((blog) => {
      return _.get(blog, "categoriesCollection.items");
    }),
    "sys.id"
  );
  // PARSE CATEGORIES THAT ARE NOT TOPICS
  const categories = _.sortBy(
    _.filter(initialCategories, (category) => {
      return !category.topic;
    }),
    "name"
  );
  // PARSE CATEGORIES THAT ARE TOPICS
  const topics = _.sortBy(
    _.filter(initialCategories, (category) => {
      return category.topic;
    }),
    "name"
  );

  // PARSE LAYOUT DATA
  const navbarData = _.get(data, "navbarCollection.items[0]");
  const seoConfigData = _.get(data, "seoConfigCollection.items[0]");
  const footerData = _.get(data, "footerCollection.items[0]");

  return {
    props: {
      blogIndexData,
      allBlogs,
      categories,
      topics,
      blogFooterData,
      seoFields,
      navbarData,
      seoConfigData,
      footerData,
    },
    revalidate: 259200,
  };
}
