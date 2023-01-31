import { useState } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
// import { browserName } from "react-device-detect";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import {
  allPartnerSlugsQuery,
  partnerDetailsQuery,
  partnerDetailsGlobalQuery,
} from "@graphql/partnerDetailsQuery";
import apolloClient from "@services/apolloClient";

import { Layout, Modal, SeoFields } from "@components/common";
import { PartnerDetailsHeader } from "@components/appTemplateDetails";
import { PartnerDetails } from "@components/partnerDetails";
import { ReviewPartner, ContactPartner } from "@components/forms";
import { PageSectionWrapper } from "@components/page";
import { Breadcrumb } from "@components/shared";

const propTypes = {
  partner: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
  }).isRequired,
  detailsGlobal: PropTypes.object.isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
};
// PartnerDetails page component
// CHANGE URL TO PARTNERS-DIRECTORY
export default function PartnerDetailsPage({
  partner,
  detailsGlobal,
  seoConfigData,
}) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const breadcrumbLink = {
    slug: "/partners-directory",
    name: "Partners List",
  };

  return (
    <>
      <SeoFields
        seoFields={{
          title: partner?.name,
          decription: partner?.description,
          image: partner?.image,
        }}
        canonical={`${seoConfigData?.canonicalUrl}/partners-directory/${partner?.slug}`}
      />
      <PageSectionWrapper
        fields={{
          backgroundColor: "grey to white",
          prevDark: false,
          nextDark: false,
        }}
        index={0}
        sections={[0]}
      >
        <Breadcrumb link={breadcrumbLink}></Breadcrumb>
        <PartnerDetailsHeader partner={partner} detailsGlobal={detailsGlobal} />
        <PartnerDetails
          partner={partner}
          detailsGlobal={detailsGlobal}
          setShowReviewModal={setShowReviewModal}
          setShowContactModal={setShowContactModal}
        />
      </PageSectionWrapper>
      {showReviewModal ? (
        <Modal
          showModal={showReviewModal}
          setShowModal={setShowReviewModal}
          restrictClose
          offsetTop
        >
          <ReviewPartner fields={detailsGlobal} />
        </Modal>
      ) : null}
      {showContactModal ? (
        <Modal
          showModal={showContactModal}
          setShowModal={setShowContactModal}
          noPadding
          restrictClose
          offsetTop
          forceScroll={true}
        >
          <ContactPartner
            fields={detailsGlobal?.contactForm}
            partner={partner}
          />
        </Modal>
      ) : null}
    </>
  );
}

PartnerDetailsPage.propTypes = propTypes;

PartnerDetailsPage.Layout = Layout;

// Graphql call for getting all templates slugs.
export const getAllPaths = gql`
  query allPartnerSlugsQuery($skip: Int, $limit: Int) {
    ${allPartnerSlugsQuery}
  }
`;

// Get the slugs of all apps in contentful & pass as a param to get static props.
export async function getStaticPaths() {
  if (process.env.NEXT_SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  const { data } = await apolloClient.query({
    query: getAllPaths,
    variables: {
      skip: 0,
      limit: 1,
    },
  });
  const partnersArray = _.get(data, "partnerCollection.items");
  return {
    // Below code just contains an error when fetched data contains unexpected value like: <nodev
    paths: partnersArray.map((partner) => {
      return { params: { slug: partner?.slug }, locale: "en" };
    }),
    fallback: "blocking",
  };
}

// Graphql call for get data with passed in variable of slug.
// query templateDetailsQuery($slug: String!) {
export const getPageData = gql`
  query partnerDetailsQuery($slug: String!) {
    ${partnerDetailsQuery}
    ${partnerDetailsGlobalQuery}
    ${layoutQuery}
  }
`;

// Get the contentful data of the app that contains the slug passed in & return props.
export async function getStaticProps({ params }) {
  // export async function getServerSideProps({ params }) {
  const { slug } = params;
  const pageDataRes = await apolloClient.query({
    query: getPageData,
    variables: { slug },
  });
  // PARSE PARTNER DATA & EVALUTATE NOT FOUND
  const partner = _.get(pageDataRes, "data.partnerCollection.items[0]");
  if (!partner) {
    return {
      notFound: true,
    };
  }
  // PARSE PARTNER DETAILS GLOBAL DATA
  const detailsGlobal = _.get(
    pageDataRes,
    "data.partnerDetailsGlobalCollection.items[0]"
  );
  // PARSE LAYOUT DATA
  const navbarData = _.get(pageDataRes, "data.navbarCollection.items[0]");
  const seoConfigData = _.get(pageDataRes, "data.seoConfigCollection.items[0]");
  const footerData = _.get(pageDataRes, "data.footerCollection.items[0]");

  return {
    props: {
      partner,
      detailsGlobal,
      navbarData,
      seoConfigData,
      footerData,
    },
    revalidate: 259200,
  };
}
