import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import {
  blogsByCategoryTotalQuery,
  blogIndexQuery,
  blogFooterQuery,
  blogsByCategoryQuery,
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
  currentCategory: PropTypes.object,
};

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
  currentCategory,
}) {
  // const featuredBlog = _.find(allBlogs, (blog) => blog.featured === true);

  let featuredBlog = _.get(blogIndexData, "featuredArticle");
  if (_.get(blogIndexData, "showNewestArticle")) {
    featuredBlog = _.first(allBlogs);
  }

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
  //   prevDark: false,
  //   nextDark: false,
  // };

  return (
    <>
      <SeoFields
        seoFields={seoFields}
        canonical={`${seoConfigData?.canonicalUrl}/blog`}
        addToTitle={currentCategory.name}
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
          />
        ) : null}
      </PageSectionWrapper>
      {/*featuredBlog ? (
        <PageImageSection
          fields={featuredBlogFields}
          index={0}
          sections={[0, 1, 2, 3]}
        />
      ) : null*/}
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
          preselectedCategory={currentCategory}
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
        <PopularBlogs blogIndexData={blogIndexData} allBlogs={allBlogs} />
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

export const getBlogsData = gql`
  query blogsQuery($skip: Int, $limit: Int, $slug: String!, $isTopic: Boolean!) {
    ${blogsByCategoryQuery}
  }
`;

// Get the slugs of all blogs in contentful & pass as a param to get static props.
export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: ["caregory", "app-tips"] }, locale: "en" }],
    fallback: "blocking",
  };
}

// Graphql call for get data with passed in variable of slug.
export const getPageData = gql`
  query blogIndexLayoutQuery($indexSlug: String!, $slug: String!, $isTopic: Boolean!) {
    ${layoutQuery}
    ${blogIndexQuery}
    ${blogsByCategoryTotalQuery}
    ${blogFooterQuery}
  }
`;

// Get the contentful data of the blog page that contains the slug passed in & return props.
export async function getStaticProps({ params }) {
  const { slug } = params;

  const categoryTypeSlug = slug[0];
  const categorySlug = slug[1];

  const allowCategoryTypes = ["category", "topic"];

  if (!allowCategoryTypes.includes(categoryTypeSlug)) {
    return {
      notFound: true,
    };
  }

  const { data } = await apolloClient.query({
    query: getPageData,
    variables: {
      indexSlug: "blog",
      slug: categorySlug,
      isTopic: categoryTypeSlug === "topic",
    },
  });

  // PARSE PAGE DATA
  // const allBlogs = _.get(data, "allBlogsDetails.items");
  const blogIndexData = _.get(data, "blogIndexPageCollection.items[0]");
  const blogFooterData = _.get(data, "blogFooter.items[0]");
  const seoFields = _.get(data, "blogIndexPageCollection.items[0].seoFields");

  // PARSE BLOGS
  const total =
    data?.blogCategoryCollection?.items[0]?.linkedFrom?.totalCollection
      ?.total || 0;

  const allBlogsByCategory = await getAllCollectionItems(
    total,
    getBlogsData,
    "blogCategory",
    400,
    {
      slug: categorySlug,
      isTopic: categoryTypeSlug === "topic",
    }
  );

  const allBlogsRaw =
    allBlogsByCategory?.[0]?.linkedFrom?.blogCollection?.items || [];

  if (!allBlogsByCategory?.[0]?.slug) {
    return {
      notFound: true,
    };
  }

  const currentCategory = {
    slug: allBlogsByCategory?.[0]?.slug,
    name: allBlogsByCategory?.[0]?.name,
    topic: categoryTypeSlug === "topic",
  };

  const allBlogs = _.filter(allBlogsRaw, (blog) => {
    const hasUseCaseCategory = blogCategoriesHasUseCase(blog);
    // DEVIATION BETWEEN BLOG & USE CASES
    if (hasUseCaseCategory) {
      return false;
    } else {
      return true;
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
      currentCategory,
    },
    revalidate: 259200,
  };
}
