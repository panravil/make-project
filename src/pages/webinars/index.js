import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import {
  webinarsTotalQuery,
  webinarIndexQuery,
  allWebinarsQuery,
} from "@graphql/webinarIndexQuery";
import apolloClient from "@services/apolloClient";
import getAllCollectionItems from "@utils/getAllCollectionItems";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";

import { Layout, SeoFields } from "@components/common";
import {
  FeaturedWebinar,
  BlogSearch,
  PopularBlogs,
} from "@components/blogPages";
import { PageSectionWrapper } from "@components/page";

const propTypes = {
  webinarIndexData: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
  allWebinars: PropTypes.arrayOf(
    PropTypes.shape({
      featuredWebinar: PropTypes.bool,
    })
  ).isRequired,
  webinarFooterData: PropTypes.object.isRequired,
  footerData: PropTypes.shape({
    subscribeModalText: PropTypes.string.isRequired,
  }).isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
  seoFields: PropTypes.object,
};

// AllWebinars page component
export default function AllWebinars({
  webinarIndexData,
  allWebinars,
  categories,
  topics,
  seoConfigData,
  seoFields,
}) {
  const featuredWebinar = _.get(webinarIndexData, "featuredWebinar");

  return (
    <>
      <SeoFields
        seoFields={seoFields}
        canonical={`${seoConfigData?.canonicalUrl}/webinars`}
      />
      <PageSectionWrapper
        fields={{
          backgroundColor: "grey",
          prevDark: false,
          nextDark: false,
        }}
        index={0}
        sections={[0, 1, 2]}
      >
        {featuredWebinar ? (
          <FeaturedWebinar
            blogIndexData={webinarIndexData}
            featuredBlog={allWebinars}
            webinar
          />
        ) : null}
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor: "white to grey",
          prevDark: false,
          nextDark: false,
        }}
        index={1}
        sections={[0, 1, 2]}
      >
        <PopularBlogs
          blogIndexData={webinarIndexData}
          allBlogs={allWebinars}
          webinar
        />
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor: "grey",
          prevDark: false,
          nextDark: false,
        }}
        index={2}
        sections={[0, 1, 2]}
      >
        <BlogSearch
          blogIndexData={webinarIndexData}
          allBlogs={allWebinars}
          categories={categories}
          topics={topics}
          webinar
        />
      </PageSectionWrapper>
    </>
  );
}

AllWebinars.propTypes = propTypes;

AllWebinars.Layout = Layout;

// Graphql call for get data with passed in variable of slug.
export const getPageData = gql`
  query webinarIndexLayoutQuery($indexSlug: String!) {
    ${layoutQuery}
    ${webinarIndexQuery}
    ${webinarsTotalQuery}
  }
`;

export const getWebinarsData = gql`
  query webinarsQuery($skip: Int, $limit: Int) {
    ${allWebinarsQuery}
  }
`;

export async function getStaticProps() {
  const { data } = await apolloClient.query({
    query: getPageData,
    variables: { indexSlug: "webinar" },
  });
  // PARSE PAGE DATA
  // const allWebinars = _.get(data, "allWebinarsDetails.items");
  const webinarIndexData = _.get(data, "blogIndexPageCollection.items[0]");
  const seoFields = _.get(data, "blogIndexPageCollection.items[0].seoFields");

  // PARSE BLOGS
  const total = _.get(data, "totalCollection.total");
  const allWebinars = await getAllCollectionItems(
    total,
    getWebinarsData,
    "webinar",
    100
  );
  // PARSE CATEGORIES FROM FILTERED BLOGS OR USE CASES
  const initialCategories = concatUniqueSortArrays(
    allWebinars.map((webinar) => {
      return _.get(webinar, "categoriesCollection.items");
    })
  );
  // PARSE CATEGORIES THAT ARE NOT TOPICS
  const categories = _.sortBy(initialCategories, "name");

  // PARSE LAYOUT DATA
  const navbarData = _.get(data, "navbarCollection.items[0]");
  const seoConfigData = _.get(data, "seoConfigCollection.items[0]");
  const footerData = _.get(data, "footerCollection.items[0]");

  return {
    props: {
      webinarIndexData,
      allWebinars,
      categories,
      seoFields,
      navbarData,
      seoConfigData,
      footerData,
    },
    revalidate: 259200,
  };
}
