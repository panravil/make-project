import { NextSeo } from "next-seo";
import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import apolloClient from "@services/apolloClient";

import { Layout } from "@components/common";

const propTypes = {
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
};

// Custom 401 page to display if unauthorized request
export default function Custom401({ seoConfigData }) {
  return (
    <section className="error">
      <NextSeo title="401" canonical={`${seoConfigData?.canonicalUrl}/401`} />
      <div className="container">
        <h1>401 - Unauthorized</h1>
      </div>
    </section>
  );
}

Custom401.propTypes = propTypes;

Custom401.Layout = Layout;

export const getAllData = gql`
  query indexPageQuery {
    ${layoutQuery}
  }
`;

export const getStaticProps = async () => {
  const { data } = await apolloClient.query({ query: getAllData });
  // PARSE LAYOUT DATA
  const navbarData = _.get(data, "navbarCollection.items[0]");
  const seoConfigData = _.get(data, "seoConfigCollection.items[0]");
  const footerData = _.get(data, "footerCollection.items[0]");

  return {
    props: { navbarData, seoConfigData, footerData },
    revalidate: 259200,
  };
};
