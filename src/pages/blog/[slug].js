import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import { allBlogSlugsQuery, blogDetailsQuery } from "@graphql/blogDetailsQuery";
import { blogFooterQuery } from "@graphql/blogIndexQuery";
import apolloClient from "@services/apolloClient";

import { Layout, SeoFields } from "@components/common";
import {
  BlogHeader,
  AuthorCard,
  BlogContent,
  BlogFooter,
  RelatedBlogs,
  ShareThisArticle,
} from "@components/blogPages";
import { PageSectionWrapper } from "@components/page";
import blogCategoriesHasUseCase from "@utils/blogCategoriesHasUseCase";

const propTypes = {
  blogData: PropTypes.shape({
    author: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
    seoFields: PropTypes.object,
  }).isRequired,
  relatedBlogs: PropTypes.array.isRequired,
  blogFooterData: PropTypes.object.isRequired,
  footerData: PropTypes.shape({
    subscribeModalText: PropTypes.string.isRequired,
  }).isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
};

// Blog Details page component
export default function BlogDetails({
  blogData,
  relatedBlogs,
  blogFooterData,
  footerData,
  seoConfigData,
}) {
  const author = _.get(blogData, "author");
  const thanksForSubscribingText = _.get(footerData, "subscribeModalText");
  const sections = relatedBlogs.length > 0 ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];
  const seoFields = _.get(blogData, "seoFields");

  return (
    <>
      <SeoFields
        seoFields={{
          title: _.get(seoFields, "title") || _.get(blogData, "title"),
          description:
            _.get(seoFields, "description") || _.get(blogData, "description"),
          image: _.get(seoFields, "image") || _.get(blogData, "image"),
        }}
        canonical={`${seoConfigData?.canonicalUrl}/blog/${blogData.slug}`}
      />
      <PageSectionWrapper
        fields={{
          backgroundColor: "grey to white",
          prevDark: false,
          nextDark: false,
        }}
        index={0}
        sections={sections}
      >
        <BlogHeader blogData={blogData} />
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor: "white",
          prevDark: false,
          nextDark: false,
        }}
        index={1}
        sections={sections}
      >
        <BlogContent blogData={blogData} />
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor: "white to grey to grey",
          prevDark: false,
          nextDark: false,
        }}
        index={2}
        sections={sections}
      >
        {author && <AuthorCard author={author} />}
        <ShareThisArticle blogFooterData={blogFooterData} />
      </PageSectionWrapper>
      {relatedBlogs.length > 0 ? (
        <PageSectionWrapper
          fields={{
            backgroundColor: "grey",
            prevDark: false,
            nextDark: true,
          }}
          index={3}
          sections={sections}
        >
          <RelatedBlogs
            blogFooterData={blogFooterData}
            relatedBlogs={relatedBlogs}
          />
        </PageSectionWrapper>
      ) : null}
      <BlogFooter
        blogFooterData={blogFooterData}
        thanksForSubscribingText={thanksForSubscribingText}
        fields={{
          backgroundColor: "grey",
          prevDark: false,
          nextDark: true,
        }}
        index={relatedBlogs.length > 0 ? 4 : 3}
        sections={sections}
      />
    </>
  );
}

BlogDetails.propTypes = propTypes;

BlogDetails.Layout = Layout;

// Graphql call for getting all blog slugs.
export const getAllPaths = gql`
  query allBlogSlugsQuery($skip: Int, $limit: Int) {
    ${allBlogSlugsQuery}
  }
`;

// Get the slugs of all blogs in contentful & pass as a param to get static props.
export async function getStaticPaths() {
  const { data } = await apolloClient.query({
    query: getAllPaths,
    variables: {
      skip: 0,
      limit: 1,
    },
  });
  // GET ITEMS & FILTER USE CASES
  const initialItems = _.get(data, "blogCollection.items") || [];
  const items = _.filter(initialItems, (blog) => {
    const hasUseCaseCategory = blogCategoriesHasUseCase(blog);
    // DEVIATION BETWEEN BLOG & USE CASES
    if (hasUseCaseCategory) {
      return false;
    } else {
      return true;
    }
  });

  return {
    paths: items.map((blog) => {
      return { params: { slug: blog?.slug }, locale: "en" };
    }),
    fallback: "blocking",
  };
}

// Graphql call for get data with passed in variable of slug.
export const getPageData = gql`
  query blogPageQuery($slug: String!, $indexSlug: String!) {
    ${blogDetailsQuery}
    ${blogFooterQuery}
  }
`;

export const getLayoutData = gql`
  query layoutQuery {
    ${layoutQuery}
  }
`;

// Get the contentful data of the blog page that contains the slug passed in & return props.
export async function getStaticProps({ params }) {
  const { slug } = params;

  const resBlog = await apolloClient.query({
    query: getPageData,
    variables: { slug, indexSlug: "blog" },
  });
  const resLayout = await apolloClient.query({
    query: getLayoutData,
    variables: {},
  });
  // PARSE PAGE DATA

  const data = resBlog.data;
  const dataLayout = resLayout.data;
  const blogData = _.get(data, "blogCollection.items[0]");
  // CHECK FOR USE CASE
  const hasUseCaseCategory = blogCategoriesHasUseCase(blogData);
  // DEVIATION BETWEEN BLOG & USE CASES
  if (!blogData || hasUseCaseCategory) {
    return {
      notFound: true,
    };
  }
  // PARSE BLOG FOOTER
  const blogFooterData = _.get(data, "blogFooter.items[0]");
  // PARSE LAYOUT DATA
  const navbarData = _.get(dataLayout, "navbarCollection.items[0]");
  const seoConfigData = _.get(dataLayout, "seoConfigCollection.items[0]");
  const footerData = _.get(dataLayout, "footerCollection.items[0]");
  // PARSE RELATED BLOGS
  const relatedBlogs = _.orderBy(
    _.filter(_.get(blogData, "relatedArticlesCollection.items"), (blog) => {
      return blog;
    }),
    "popularity",
    "desc"
  );

  return {
    props: {
      blogData,
      relatedBlogs,
      navbarData,
      blogFooterData,
      seoConfigData,
      footerData,
    },
    revalidate: 259200,
  };
}
