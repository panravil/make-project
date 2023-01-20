import _ from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import {
  allAppSlugsQuery,
  appDetailsQuery,
  appDetailsGlobalQuery,
  appsTotalQuery,
  integrateAppsQuery,
} from "@graphql/appDetailsQuery";
import apolloClient from "@services/apolloClient";

import { Layout, SeoFields } from "@components/common";
import { IntegrateApps } from "@components/appDetails";
import {
  AppDetailsHeader,
  TemplatesSearchSimilar,
  TriggersAndActions,
  HowItWorks,
} from "@components/appTemplateDetails";
import {
  PageFaqSection,
  PageSectionWrapper,
  PageTestimonialSection,
} from "@components/page";

import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";
import { getSimilarApps, getTemplatesByApp } from "@utils/getAppData";
import replaceSeoWildCard from "@utils/replaceSeoWildCard";

const propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    triggersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    actionsJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    aggregatorsJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    feedersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    transformersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    searchesJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  }).isRequired,
  templates: PropTypes.arrayOf(PropTypes.object.isRequired),
  integratedApps: PropTypes.arrayOf(PropTypes.object.isRequired),
  total: PropTypes.number.isRequired,
  appDetails: PropTypes.object.isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
};

// AppDetails page component
export default function AppDetails({
  app,
  templates,
  integrateApps,
  total,
  appDetails,
  seoConfigData,
}) {
  // the shorthand for priority needs to be expanded to cover null cases
  // in order for descending order to work properly (no null before max)
  const combinedTemplates = _.orderBy(
    concatUniqueSortArrays([templates]),
    (template) => {
      return template.priority || "";
    },
    "desc"
  );

  return (
    <>
      <SeoFields
        seoFields={replaceSeoWildCard(
          _.get(appDetails, "seoFields"),
          total,
          app.name
        )}
        canonical={`${seoConfigData?.canonicalUrl}/integrations/${app.slug}`}
      />
      <PageSectionWrapper
        fields={{
          backgroundColor: "grey to white",
          prevDark: false,
          nextDark: false,
        }}
        index={0}
        sections={[0, 1, 2, 3, 4]}
      >
        <AppDetailsHeader app={app} appDetails={appDetails} total={total} />
        <TriggersAndActions app={app} appDetails={appDetails} total={total} />
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor: "white",
          prevDark: false,
          nextDark: false,
        }}
        index={1}
        sections={[0, 1, 2, 3, 4]}
      >
        <IntegrateApps
          app={app}
          apps={integrateApps}
          appDetails={appDetails}
          total={total}
        />
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor:
            _.get(appDetails, "faqSection.backgroundColor") === "grey"
              ? "white to grey"
              : "white",
          prevDark: false,
          nextDark: false,
        }}
        index={2}
        sections={[0, 1, 2, 3, 4]}
      >
        <TemplatesSearchSimilar
          search
          name={app?.name}
          templates={combinedTemplates}
          appDetails={appDetails}
          total={total}
        />
      </PageSectionWrapper>
      <PageFaqSection
        fields={{
          ..._.get(appDetails, "faqSection"),
          prevDark: false,
          nextDark: true,
        }}
        index={3}
        sections={[0, 1, 2, 3, 4]}
      />
      <HowItWorks
        name={app.name}
        appDetails={appDetails}
        total={total}
        fields={{
          backgroundColor: "dark mode",
          prevDark: false,
          nextDark: true,
        }}
        index={4}
        sections={[0, 1, 2, 3, 4]}
      />
      <PageTestimonialSection
        fields={_.get(appDetails, "testimonialSection")}
        index={null}
      />
    </>
  );
}

AppDetails.propTypes = propTypes;

AppDetails.Layout = Layout;

// Graphql call for getting all apps total count.
export const getAllPathsTotal = gql`
  query allAppSlugsTotalQuery {
    ${appsTotalQuery}
  }
`;

// Graphql call for getting all app slugs.
export const getAllPaths = gql`
  query allAppSlugsQuery($skip: Int, $limit: Int) {
    ${allAppSlugsQuery}
  }
`;

// Get the slugs of all apps in contentful & pass as a param to get static props.
export async function getStaticPaths() {
  const { data } = await apolloClient.query({
    query: getAllPaths,
    variables: {
      skip: 0,
      limit: 1,
    },
  });
  const appsArray = _.get(data, "appCollection.items");

  return {
    paths: appsArray.map((app1) => {
      return { params: { slug: app1?.slug }, locale: "en" };
    }),
    fallback: "blocking",
  };
}

// Graphql call for get data with passed in variable of slug.
export const getPageData = gql`
  query appDetailsQuery($slug: String!, $appLimit: Int) {
    ${appDetailsQuery}
    ${appDetailsGlobalQuery}
    ${layoutQuery}
    ${appsTotalQuery}
  }
`;

export const getIntegrateAppsData = gql`
  query integrateAppsQuery($slug: String, $skip: Int, $limit: Int) {
    ${integrateAppsQuery}
  }
`;

// Get the contentful data of the app that contains the slug passed in & return props.
export async function getStaticProps({ params }) {
  const { slug } = params;
  const [pageDataRes, integrateAppsRes, integrateAppsRes2] = await Promise.all([
    apolloClient.query({
      query: getPageData,
      variables: { slug, appLimit: 100 },
    }),
    // ALTENRATIVE TO GETTING ALL APPS TO INTEGRATE WITH FOR BUILD TIMES
    apolloClient.query({
      query: getIntegrateAppsData,
      variables: { slug, skip: 0, limit: 1000 },
    }),
    apolloClient.query({
      query: getIntegrateAppsData,
      variables: { slug, skip: 1000, limit: 1000 },
    }),
  ]);

  // GET APP DATA & EVALUATE NOT FOUND
  const app = _.get(pageDataRes, "data.appCollection.items[0]");
  if (!app) {
    return {
      notFound: true,
    };
  }
  // PARSE PAGE DATA
  const total = _.get(pageDataRes, "data.totalCollection.total");
  //const templates = getTemplatesFromApp(pageDataRes);
  const templates = await getTemplatesByApp(slug, 750);

  const similarApps = getSimilarApps(pageDataRes);
  const appDetails = _.get(
    pageDataRes,
    "data.appDetailsGlobalCollection.items[0]"
  );
  // GET ALL APPS TO INTEGRATE WITH
  // the shorthand for priority needs to be expanded to cover null cases
  // in order for descending order to work properly (no null before max)
  const integrateApps = _.orderBy(
    concatUniqueSortArrays([
      _.get(integrateAppsRes, "data.appCollection.items"),
      _.get(integrateAppsRes2, "data.appCollection.items"),
    ]),
    (app) => {
      return app?.priority || "";
    },
    "desc"
  );
  // PARSE LAYOUT DATA
  const navbarData = _.get(pageDataRes, "data.navbarCollection.items[0]");
  const seoConfigData = _.get(pageDataRes, "data.seoConfigCollection.items[0]");
  const footerData = _.get(pageDataRes, "data.footerCollection.items[0]");

  return {
    props: {
      app,
      templates,
      similarApps,
      appDetails,
      integrateApps,
      total,
      navbarData,
      seoConfigData,
      footerData,
    },
    revalidate: 259200,
  };
}
