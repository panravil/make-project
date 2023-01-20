import _, { functions } from "lodash";
import PropTypes from "prop-types";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import {
  appDetailsQuery,
  appDetailsGlobalQuery,
  integrateAppsQuery,
  integrateAppsQueryMultiple,
  appsTotalQuery,
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
import { getTemplatesByApp, getSimilarApps } from "@utils/getAppData";
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
  app2: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    triggersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    actionsJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    aggregatorsJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    feedersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    transformersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    searchesJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  }).isRequired,
  app3: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    triggersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    actionsJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    aggregatorsJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    feedersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    transformersJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    searchesJson: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  }),
  templates: PropTypes.array,
  templates2: PropTypes.array,
  templates3: PropTypes.array,
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
  app2,
  app3,
  templates,
  templates2,
  templates3,
  integrateApps,
  total,
  appDetails,
  seoConfigData,
}) {
  // the shorthand for priority needs to be expanded to cover null cases
  // in order for descending order to work properly (no null before max)
  const combinedTemplates =
    templates3?.length > 0
      ? _.orderBy(
          _.intersectionBy(templates, templates2, templates3, "name"),
          (template) => {
            return template.priority || "";
          },
          "desc"
        )
      : _.orderBy(
          _.intersectionBy(templates, templates2, "name"),
          (template) => {
            return template.priority || "";
          },
          "desc"
        );

  const duplicateApp2ndLevel = app.slug === app2.slug ? true : false;

  function canonicalUrl() {
    if (duplicateApp2ndLevel) {
      return `${seoConfigData?.canonicalUrl}/integrations/${app.slug}`;
    } else {
      return `${seoConfigData?.canonicalUrl}/integrations/${app.slug}${
        app2 ? "/" + app2.slug : ""
      }${app3 ? "/" + app3.slug : ""}`;
    }
  }

  return (
    <>
      <SeoFields
        seoFields={replaceSeoWildCard(_.get(appDetails, "seoFields"), total, [
          app?.name,
          app2?.name,
          app3?.name,
        ])}
        canonical={canonicalUrl()}
        noindex={duplicateApp2ndLevel ? true : null}
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
        <AppDetailsHeader
          app={app}
          app2={app2}
          app3={app3}
          appDetails={appDetails}
          total={total}
        />
        {!app3 && (
          <TriggersAndActions
            app={app}
            app2={app2}
            appDetails={appDetails}
            total={total}
          />
        )}
        {app3 && (
          <TriggersAndActions
            app={app}
            app2={app2}
            app3={app3}
            appDetails={appDetails}
            total={total}
          />
        )}
      </PageSectionWrapper>
      {!app3 ? (
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
            app2={app2}
            apps={integrateApps}
            appDetails={appDetails}
            total={total}
          />
        </PageSectionWrapper>
      ) : null}
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
          name2={app2?.name}
          name3={app3?.name}
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
        name2={app2.name}
        name3={app2.name}
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
  query integrateAppsQuery($slug: String, $slug2: String, $skip: Int, $limit: Int) {
    ${integrateAppsQueryMultiple}
  }
`;

// Graphql call for get data with passed in variable of slug.
export const getApp2Data = gql`
  query app2DetailsQuery($slug: String!, $appLimit: Int) {
    ${appDetailsQuery}
  }
`;

// Get the contentful data of the app that contains the slug passed in & return props.
// export async function getStaticProps({ params }) {
export async function getServerSideProps({ params, res }) {
  res.setHeader("Cache-Control", `s-maxage=259200, stale-while-revalidate`);

  const { slug } = params;
  const is3App = slug.length > 2;
  const [pageDataRes, app2Res, app3Res, integrateAppsRes, integrateAppsRes2] =
    await Promise.all([
      // First App
      apolloClient.query({
        query: getPageData,
        variables: {
          slug: slug[0],
          appLimit: 100,
        },
      }),
      // Second App
      apolloClient.query({
        query: getApp2Data,
        variables: {
          slug: slug[1],
          appLimit: 100,
        },
      }),
      // Third App
      is3App
        ? apolloClient.query({
            query: getApp2Data,
            variables: {
              slug: slug[2],
              appLimit: 100,
            },
          })
        : null,
      // ALTENRATIVE TO GETTING ALL APPS TO INTEGRATE WITH FOR BUILD TIMES
      !is3App
        ? apolloClient.query({
            query: getIntegrateAppsData,
            variables: { slug: slug[0], slug2: slug[1], skip: 0, limit: 1000 },
          })
        : null,
      !is3App
        ? apolloClient.query({
            query: getIntegrateAppsData,
            variables: {
              slug: slug[0],
              slug2: slug[1],
              skip: 1000,
              limit: 1000,
            },
          })
        : null,
    ]);
  // GET APP DATA & EVALUATE NOT FOUND
  const app = _.get(pageDataRes, "data.appCollection.items[0]");
  const app2 = _.get(app2Res, "data.appCollection.items[0]");
  const app3 = _.get(app3Res, "data.appCollection.items[0]") || null;
  if (!app || !app2 || (is3App && !app3) || slug.length > 3) {
    return {
      notFound: true,
    };
  }

  const allTemplates = await getTemplatesByApp(slug, 750);

  // PARSE PAGE DATA
  const total = _.get(pageDataRes, "data.totalCollection.total");

  const appDetails = _.get(
    pageDataRes,
    "data.appDetailsGlobalCollection.items[0]"
  );

  const similarApps = getSimilarApps(pageDataRes);
  const similarApps2 = getSimilarApps(app2Res);
  const similarApps3 = getSimilarApps(app3Res) || null;

  let templates = [];
  let templates2 = [];
  let templates3 = [];

  if (!allTemplates?.length) {
    templates = await getTemplatesByApp(slug[0], 750);
    templates2 = await getTemplatesByApp(slug[1], 750);
    templates3 = (await getTemplatesByApp(slug[2], 750)) || null;
  } else {
    templates = allTemplates;
    templates2 = allTemplates;
    templates3 = allTemplates;
  }

  const integrateApps = is3App
    ? null
    : _.orderBy(
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
      integrateApps,
      total,
      appDetails,
      app2,
      templates2,
      similarApps2,
      app3,
      templates3,
      similarApps3,
      navbarData,
      seoConfigData,
      footerData,
    },
    // revalidate: 259200,
  };
}
