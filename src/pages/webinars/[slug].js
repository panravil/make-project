import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import {
  allWebinarSlugsQuery,
  webinarDetailsQuery,
  webinarIndexQuery,
} from "@graphql/webinarDetailsQuery";
import apolloClient from "@services/apolloClient";

import { Layout, SeoFields } from "@components/common";
import { WebinarHeader, RelatedWebinars } from "@components/webinarPages";
import { PageSectionWrapper } from "@components/page";

const propTypes = {
  webinarData: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.object,
    seoFields: PropTypes.object,
  }).isRequired,
  relatedWebinars: PropTypes.array.isRequired,
  relatedTitle: PropTypes.string.isRequired,
  blogFooterData: PropTypes.object.isRequired,
  footerData: PropTypes.shape({
    subscribeModalText: PropTypes.string.isRequired,
  }).isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
};

// Webinar Details page component
export default function BlogDetails({
  seoConfigData,
  webinarData,
  relatedWebinars,
  relatedTitle,
}) {
  const seoFields = _.get(webinarData, "seoFields");
  const sections = relatedWebinars.length > 0 ? [0, 1, 2] : [0, 1];

  return (
    <>
      <SeoFields
        seoFields={{
          title: _.get(seoFields, "title") || _.get(webinarData, "name"),
          description:
            _.get(seoFields, "description") ||
            _.get(webinarData, "description"),
          image: _.get(seoFields, "image") || _.get(webinarData, "image"),
        }}
        canonical={`${seoConfigData?.canonicalUrl}/webinars/${webinarData?.slug}`}
      />

      <PageSectionWrapper
        fields={{
          backgroundColor:
            Object.keys(webinarData).length > 0 ? "grey" : "grey to white",
          prevDark: false,
          nextDark: false,
        }}
        index={0}
        sections={sections}
      >
        <WebinarHeader webinarData={webinarData} />
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor: "white",
          prevDark: false,
          nextDark: false,
        }}
        index={1}
        sections={sections}
      ></PageSectionWrapper>
      {relatedWebinars.length > 0 ? (
        <PageSectionWrapper
          fields={{
            backgroundColor: "grey",
            prevDark: false,
            nextDark: true,
          }}
          index={2}
          sections={sections}
        >
          <RelatedWebinars
            relatedWebinars={relatedWebinars}
            relatedTitle={relatedTitle}
          />
        </PageSectionWrapper>
      ) : null}
    </>
  );
}

BlogDetails.propTypes = propTypes;

BlogDetails.Layout = Layout;

// Graphql call for getting all blog slugs.
export const getAllPaths = gql`
  query allBlogSlugsQuery($skip: Int, $limit: Int) {
    ${allWebinarSlugsQuery}
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
  const items = _.get(data, "webinarCollection.items") || [];

  return {
    paths: items.map((webinar) => {
      return { params: { slug: webinar?.slug } };
    }),
    fallback: "blocking",
  };
}

// Graphql call for get data with passed in variable of slug.
export const getPageData = gql`
  query webinarPageQuery($slug: String!, $indexSlug: String!) {
    ${webinarDetailsQuery}
    ${webinarIndexQuery}
    ${layoutQuery}
  }
`;

// Get the contentful data of the blog page that contains the slug passed in & return props.
export async function getStaticProps({ params }) {
  const { slug } = params;

  const { data } = await apolloClient.query({
    query: getPageData,
    variables: { slug, indexSlug: "webinar" },
  });
  // PARSE PAGE DATA
  const webinarData = _.get(data, "webinarCollection.items[0]");
  if (!webinarData) {
    return {
      notFound: true,
    };
  }
  // PARSE LAYOUT DATA
  const navbarData = _.get(data, "navbarCollection.items[0]");
  const seoConfigData = _.get(data, "seoConfigCollection.items[0]");
  const footerData = _.get(data, "footerCollection.items[0]");
  // PARSE RELATED BLOGS
  const relatedWebinars = _.orderBy(
    _.filter(
      _.get(webinarData, "relatedWebinarsCollection.items"),
      (webinar) => {
        return webinar;
      }
    ),
    "viewCount",
    "desc"
  );
  const relatedTitle = _.get(
    data,
    "blogIndexPageCollection.items[0].relatedTitle"
  );

  return {
    props: {
      webinarData,
      relatedWebinars,
      relatedTitle,
      navbarData,
      seoConfigData,
      footerData,
    },
    revalidate: 259200,
  };
}
