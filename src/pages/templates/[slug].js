import styles from "@styles/pages/templates.module.scss";
import { useState, useEffect } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { browserName } from "react-device-detect";
import Image from "next/image";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import {
  templateDetailsQuery,
  templateDetailsGlobalQuery,
  similarTemplatesQuery,
  allTemplateSlugsQuery,
  templatesTotalQuery,
} from "@graphql/templateDetailsQuery";
import apolloClient from "@services/apolloClient";

import { Layout, SeoFields } from "@components/common";
import {
  TemplateDetailsHeader,
  TemplatesSearchSimilar,
  TriggersAndActions,
} from "@components/appTemplateDetails";
import {
  PageFaqSection,
  PageSectionWrapper,
  PageTestimonialSection,
} from "@components/page";

import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";
import replaceSeoWildCard from "@utils/replaceSeoWildCard";
import desktopScreen from "../../../public/animationScreen.svg";

const propTypes = {
  template: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    videoUrl: PropTypes.string,
    videoImage: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    subDescription: PropTypes.string,
    makeId: PropTypes.string,
  }).isRequired,
  templateDetails: PropTypes.object,
  similarTemplates: PropTypes.arrayOf(PropTypes.object.isRequired),
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
  total: PropTypes.number.isRequired,
};

function getSortedTemplatesMinusSelf(initialTemplate, templateArray) {
  const combinedTemplatesArray = concatUniqueSortArrays([templateArray]);
  return _.filter(combinedTemplatesArray, (item) => {
    return item.slug !== initialTemplate.slug;
  });
}
// TemplateDetails page component
export default function TemplateDetails({
  template,
  templateDetails,
  similarTemplates,
  seoConfigData,
  total,
}) {
  // the shorthand for priority needs to be expanded to cover null cases
  // in order for descending order to work properly (no null before max)
  const sortedSimilarTemplates = _.orderBy(
    getSortedTemplatesMinusSelf(template, similarTemplates),
    (template) => {
      return template.priority || "";
    },
    "desc"
  );
  const app = _.get(template, "appsCollection.items[0]");
  const app2 = _.get(template, "appsCollection.items[1]");
  const app3 = _.get(template, "appsCollection.items[2]");
  const animation = _.get(template, "animation");
  const [isSafari, setIsSafari] = useState(null);

  const getAnimationBaseUrl = () => {
    return process.env.NEXT_PUBLIC_TEMPLATE_ANIMATION_BASE_URL;
  };

  useEffect(() => {
    setIsSafari(browserName === "Safari");
  }, [browserName]);

  return (
    <>
      <SeoFields
        seoFields={replaceSeoWildCard(
          _.get(templateDetails, "seoFields"),
          total,
          template.seoFields?.title || template?.name,
          template.seoFields?.description || template?.description
        )}
        canonical={`${seoConfigData?.canonicalUrl}/templates/${template.slug}`}
        noindex={template.seoFields?.noindex ?? true}
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
        <TemplateDetailsHeader
          template={template}
          templateDetails={templateDetails}
          total={total}
        />

        <div className={`container ${styles.templateAnimationIframeContainer}`}>
          <Image src={desktopScreen} layout={"fill"} />
          <iframe
            className={styles.templateAnimationIframe}
            id="template_animation"
            title={`animation`}
            src={`${getAnimationBaseUrl()}/${template.slug}?publicId=${
              template.makeId
            }`}
            allowFullScreen={false}
            allowtransparency="true"
            referrerPolicy="origin"
            fetchpriority="high"
          />
        </div>
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
        <TemplatesSearchSimilar
          name={template?.name}
          templates={sortedSimilarTemplates}
          appDetails={templateDetails}
          total={total}
          search
        />
      </PageSectionWrapper>
      <PageSectionWrapper
        fields={{
          backgroundColor:
            _.get(templateDetails, "templateFaq.backgroundColor") === "grey"
              ? "white to grey"
              : "white",
          prevDark: false,
          nextDark:
            _.get(templateDetails, "templateFaq.backgroundColor") ===
            "dark mode",
        }}
        index={2}
        sections={[0, 1, 2, 3, 4]}
      >
        <TriggersAndActions
          app={app}
          app2={app2}
          app3={app3}
          appDetails={templateDetails}
          total={total}
        />
      </PageSectionWrapper>
      <PageFaqSection
        fields={{
          ..._.get(templateDetails, "templateFaq"),
          prevDark: false,
          nextDark:
            _.get(templateDetails, "testimonialSection.backgroundColor") ===
            "dark mode",
        }}
        index={3}
        sections={[0, 1, 2, 3, 4]}
      />
      <PageTestimonialSection
        fields={{
          ..._.get(templateDetails, "testimonialSection"),
          prevDark:
            _.get(templateDetails, "templateFaq.backgroundColor") ===
            "dark mode",
          nextDark: true,
        }}
        index={4}
        sections={[0, 1, 2, 3, 4]}
      />
    </>
  );
}

TemplateDetails.propTypes = propTypes;

TemplateDetails.Layout = Layout;

// Graphql call for getting all templates slugs.
export const getAllPaths = gql`
  query allTemplateSlugsQuery($skip: Int, $limit: Int) {
    ${allTemplateSlugsQuery}
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
  const templatesArray = _.get(data, "templateCollection.items");
  return {
    paths: templatesArray.map((template) => {
      return { params: { slug: template?.slug }, locale: "en" };
    }),
    fallback: "blocking",
  };
}

// Graphql call for get data with passed in variable of slug.
// query templateDetailsQuery($slug: String!) {
export const getPageData = gql`
  query templateDetailsQuery($slug: String!, $templateLimit: Int) {
    ${templateDetailsQuery}
    ${templateDetailsGlobalQuery}
    ${similarTemplatesQuery}
    ${templatesTotalQuery}
  }
`;

export const getLayoutData = gql`
  query layoutQuery {
    ${layoutQuery}
  }
`;

// Get the contentful data of the app that contains the slug passed in & return props.
export async function getStaticProps({ params }) {
  // export async function getServerSideProps({ params }) {
  const { slug } = params;
  const pageDataRes = await apolloClient.query({
    query: getPageData,
    variables: { slug, templateLimit: 60 },
  });

  const layoutDataRes = await apolloClient.query({
    query: getLayoutData,
  });

  // PARSE TEMPLATE DATA & EVALUTATE NOT FOUND
  const template = _.get(pageDataRes, "data.templateCollection.items[0]");
  if (!template) {
    return {
      notFound: true,
    };
  }
  // PARSE PAGE DATA
  const templateDetails = _.get(
    pageDataRes,
    "data.templateDetailsGlobalCollection.items[0]"
  );
  const total = _.get(pageDataRes, "data.totalCollection.total");
  // PARSE SIMILAR TEMPLATES DATA
  function getSimilarTemplates(res) {
    const subcategoryCollection =
      _.get(
        res,
        "data.similarTemplates.items[0].subcategoriesCollection.items"
      ) || [];
    return concatUniqueSortArrays(
      subcategoryCollection.map((subcategory) => {
        return _.get(subcategory, "templatesCollection.items") || [];
      })
    );
  }
  const similarTemplates = getSimilarTemplates(pageDataRes);
  // PARSE LAYOUT DATA
  const navbarData = _.get(layoutDataRes, "data.navbarCollection.items[0]");
  const seoConfigData = _.get(
    layoutDataRes,
    "data.seoConfigCollection.items[0]"
  );
  const footerData = _.get(layoutDataRes, "data.footerCollection.items[0]");

  return {
    props: {
      template,
      templateDetails,
      similarTemplates,
      total,
      navbarData,
      seoConfigData,
      footerData,
    },
    revalidate: 259200,
  };
}
