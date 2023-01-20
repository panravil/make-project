import styles from "@styles/pages/pricing.module.scss";
import { useState } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";
import PropTypes from "prop-types";
import cn from "classnames";

import { gql } from "@apollo/client";
import { layoutQuery } from "@graphql/layoutQuery";
import { pricingDetailsQuery } from "@graphql/pricingDetailsQuery";
import apolloClient from "@services/apolloClient";

import { Layout, SeoFields } from "@components/common";
import { PageSectionWrapper, PageFaqSection } from "@components/page";
import {
  PricingHeader,
  PlanCard,
  ComparisonDesktop,
  ComparisonMobile,
} from "@components/pricing";

const propTypes = {
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
  pricingData: PropTypes.shape({
    planCardsCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          planDescription: PropTypes.string.isRequired,
          planFeatures: PropTypes.array.isRequired,
          planFeaturesTitle: PropTypes.string.isRequired,
          planTitle: PropTypes.string.isRequired,
          demoRequestLink: PropTypes.object,
          upgradeButton: PropTypes.object.isRequired,
          pricingJSON: PropTypes.array,
          annualShowMonthlyOperations: PropTypes.bool,
        })
      ),
    }),
    currentPlanTitle: PropTypes.string.isRequired,
    popularPlanTitle: PropTypes.string.isRequired,
    seeDetailsText: PropTypes.string.isRequired,
    enterpriseTitle: PropTypes.string.isRequired,
    enterpriseUseDescription: PropTypes.string.isRequired,
    enterpriseSubdescription: PropTypes.string.isRequired,
    enterpriseButton: PropTypes.object.isRequired,
    enterpriseDemoRequestLink: PropTypes.object,
    enterpriseFeaturesTitle: PropTypes.string.isRequired,
    enterpriseFeatures: PropTypes.array.isRequired,
    operationsPerMonthText: PropTypes.string.isRequired,
    operationsPerYearText: PropTypes.string.isRequired,
    dropdownReachOutText: PropTypes.string.isRequired,
  }).isRequired,
};

// Pricing Page Component
export default function Pricing({ seoConfigData, pricingData, seoFields }) {
  const { register, handleSubmit, watch, setValue, control } = useForm();
  const [isMonthly, setIsMonthly] = useState(false);
  const planCardsArray = _.get(pricingData, "planCardsCollection.items");

  const onSubmit = (data, event) => {
    event.preventDefault();
  };

  const renderPlanCards = planCardsArray.map((planCard, index) => {
    const planFeaturesTitle = _.get(planCard, "planFeaturesTitle");
    const demoRequestLink = _.get(planCard, "demoRequestLink");
    const upgradeButton = _.get(planCard, "upgradeButton");
    const pricingJSON = _.get(planCard, "pricingJson");
    const showMonthlyOperations = _.get(
      planCard,
      "annualShowMonthlyOperations"
    );
    const operationsText = showMonthlyOperations
      ? _.get(pricingData, "operationsPerMonthText")
      : isMonthly
      ? _.get(pricingData, "operationsPerMonthText")
      : _.get(pricingData, "operationsPerYearText");
    const reachOutText = _.get(pricingData, "dropdownReachOutText");

    return (
      <PlanCard
        key={index}
        popularPlan={planCard.mostPopularOption}
        currentPlanTitle={pricingData.currentPlanTitle}
        popularPlanTitle={pricingData.popularPlanTitle}
        seeDetailsText={pricingData.seeDetailsText}
        priceDescription={
          isMonthly
            ? planCard.priceDescriptionMonth
            : planCard.priceDescriptionYear
        }
        toolTip={planCard.toolTip}
        planName={planCard.planTitle}
        planUses={planCard.planDescription}
        upgradeButton={upgradeButton}
        demoRequestLink={demoRequestLink}
        planFeaturesTitle={planFeaturesTitle}
        featuresArray={planCard.planFeatures}
        register={register}
        setValue={setValue}
        isMonthly={isMonthly}
        control={control}
        watch={watch}
        pricingJSON={pricingJSON}
        operationsText={operationsText}
        reachOutText={reachOutText}
        showMonthlyOperations={showMonthlyOperations}
      />
    );
  });

  return (
    <>
      <SeoFields
        seoFields={seoFields}
        canonical={`${seoConfigData?.canonicalUrl}/pricing`}
      />
      <form name="upgradePlan" onSubmit={handleSubmit(onSubmit)}>
        <PageSectionWrapper
          fields={{
            backgroundColor: "grey to white",
            prevDark: false,
            nextDark: false,
          }}
          index={0}
          sections={[0, 1, 2]}
        >
          <PricingHeader
            pricingData={pricingData}
            setIsMonthly={setIsMonthly}
            isMonthly={isMonthly}
            register={register}
          />
          <div className="container">
            <div className={cn(styles.planCardSection, styles.showScrollbar)}>
              {renderPlanCards}
              <PlanCard
                currentPlanTitle={pricingData.currentPlanTitle}
                seeDetailsText={pricingData.seeDetailsText}
                toolTip={pricingData.enterpriseToolTip}
                planName={pricingData.enterpriseTitle}
                planUses={pricingData.enterpriseUseDescription}
                planSubdescription={pricingData.enterpriseSubdescription}
                enterpriseButton={pricingData.enterpriseButton}
                demoRequestLink={pricingData.enterpriseDemoRequestLink}
                featuresArray={pricingData.enterpriseFeatures}
                planFeaturesTitle={pricingData.enterpriseFeaturesTitle}
                register={register}
                setValue={setValue}
                control={control}
                watch={watch}
                isMonthly={isMonthly}
              />
            </div>
          </div>
        </PageSectionWrapper>
      </form>
      <div className={styles.showMobile}>
        <PageSectionWrapper
          fields={{
            backgroundColor: "white to white to grey",
            prevDark: false,
            nextDark: false,
          }}
          index={1}
          sections={[0, 1, 2]}
        >
          <ComparisonMobile pricingData={pricingData} />
        </PageSectionWrapper>
      </div>
      <div className={styles.showDesktop}>
        <PageSectionWrapper
          fields={{
            backgroundColor:
              _.get(pricingData, "faq.backgroundColor") === "grey"
                ? "white to white to grey"
                : "white",
            prevDark: false,
            nextDark: false,
          }}
          index={1}
          sections={[0, 1, 2]}
        >
          <ComparisonDesktop pricingData={pricingData} />
        </PageSectionWrapper>
      </div>
      <PageFaqSection
        fields={{
          ..._.get(pricingData, "faq"),
          prevDark: false,
          nextDark: true,
        }}
        index={2}
        sections={[0, 1, 2]}
      />
    </>
  );
}

Pricing.propTypes = propTypes;

Pricing.Layout = Layout;

export const getAllData = gql`
  query pricingPageQuery {
    ${layoutQuery}
    ${pricingDetailsQuery}
  }
`;

export const getStaticProps = async () => {
  const { data } = await apolloClient.query({ query: getAllData });
  // PARSE PAGE DATA
  const pricingData = _.get(data, "pricingPageCollection.items[0]");
  const seoFields = _.get(data, "pricingPageCollection.items[0].seoFields");
  // PARSE LAYOUT DATA
  const navbarData = _.get(data, "navbarCollection.items[0]");
  const seoConfigData = _.get(data, "seoConfigCollection.items[0]");
  const footerData = _.get(data, "footerCollection.items[0]");

  return {
    props: {
      navbarData,
      seoConfigData,
      footerData,
      pricingData,
      seoFields,
    },
    revalidate: 259200,
  };
};
