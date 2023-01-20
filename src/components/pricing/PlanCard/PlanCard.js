import { useState, useEffect } from "react";
import styles from "./PlanCard.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import { Link } from "@components/common";
import ReactMarkdown from "react-markdown";

import { DropdownPricing } from "@components/common";

import CheckMark from "@icons/CheckMark";
import NextIcon from "@icons/NextIcon";
import _ from "lodash";

const propTypes = {
  currentPlan: PropTypes.bool,
  currentPlanTitle: PropTypes.string.isRequired,
  popularPlan: PropTypes.bool,
  popularPlanTitle: PropTypes.string,
  seeDetailsText: PropTypes.string.isRequired,
  priceDescription: PropTypes.string,
  planName: PropTypes.string.isRequired,
  planUses: PropTypes.string.isRequired,
  planSubdescription: PropTypes.string,
  enterpriseButton: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  upgradeButton: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    dataRole: PropTypes.string,
    dataCta: PropTypes.string,
  }),
  demoRequestLink: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    dataRole: PropTypes.string,
    dataCta: PropTypes.string,
  }),
  planFeaturesTitle: PropTypes.string.isRequired,
  featuresArray: PropTypes.array.isRequired,
  isMonthly: PropTypes.bool.isRequired,
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  pricingJSON: PropTypes.arrayOf(
    PropTypes.shape({
      monthly: PropTypes.shape({
        price: PropTypes.string.isRequired,
        operations: PropTypes.string.isRequired,
      }),
      yearly: PropTypes.shape({
        price: PropTypes.string.isRequired,
        operations: PropTypes.string.isRequired,
      }),
    })
  ),
  operationsText: PropTypes.string,
  reachOutText: PropTypes.string,
  showMonthlyOperations: PropTypes.bool,
};

// Component that renders individual plan cards based on the plans options
const PlanCard = ({
  currentPlan,
  currentPlanTitle,
  popularPlan,
  popularPlanTitle,
  seeDetailsText,
  priceDescription,
  planName,
  planUses,
  planSubdescription,
  enterpriseButton,
  upgradeButton,
  demoRequestLink,
  planFeaturesTitle,
  featuresArray,
  isMonthly,
  control,
  setValue,
  watch,
  pricingJSON,
  operationsText,
  reachOutText,
  showMonthlyOperations,
}) => {
  const isEnterprise = planName === "Enterprise";
  const isFree = planName === "Free";
  const monthOrYearPrice = isMonthly
    ? _.get(pricingJSON, "[0].monthly.price")
    : _.get(pricingJSON, "[0].annually.price");
  const monthOrYearOperations = showMonthlyOperations
    ? _.get(pricingJSON, "[0].monthly.operations")
    : isMonthly
    ? _.get(pricingJSON, "[0].monthly.operations")
    : _.get(pricingJSON, "[0].annually.operations");
  let headingText;
  if (currentPlan) {
    headingText = currentPlanTitle;
  } else if (popularPlan) {
    headingText = popularPlanTitle;
  }

  const [price, setPrice] = useState(monthOrYearPrice || "$0");
  const [showDetails, setShowDetails] = useState(false);
  const renderOperations = watch(planName) || monthOrYearOperations;

  // useEffect that sets the price back to the lowest priced option on changing
  // monthly and yearly
  useEffect(() => {
    if (!isEnterprise) {
      setValue(planName, monthOrYearOperations);
    }
  }, [isMonthly]);

  // useEffect that grabs the price based off of the index of
  // the selected number of operations
  // & whether is monthly or show monthly operations.
  useEffect(() => {
    const planOption = watch(planName);
    const index = _.findIndex(pricingJSON, (option) => {
      if (isMonthly || showMonthlyOperations) {
        return (
          (_.get(option, "monthly.operations") || "") ===
          (planOption || "").toString()
        );
      } else {
        return (
          (_.get(option, "annually.operations") || "") ===
          (planOption || "").toString()
        );
      }
    });
    const optionPrice =
      index > -1
        ? isMonthly
          ? _.get(pricingJSON[index], "monthly.price")
          : _.get(pricingJSON[index], "annually.price") ||
            _.get(pricingJSON[index], "monthly.price")
        : "$0";
    setPrice(optionPrice);
  }, [isMonthly, watch(planName)]);

  // Request demo link that's used in all renders of plan options
  const requestDemoLink = (
    <div className={styles.linkWrapper}>
      {demoRequestLink?.slug ? (
        <Link className="small bold" link={demoRequestLink} />
      ) : null}
    </div>
  );

  // Function to render the Price of the selected option
  const renderOptionPrice = (price) => {
    // Regex used to split on $ and .
    const regex = /([$.])/;
    // get the Price array and remove empty string at the start
    const priceArray = price.split(regex).slice(1);
    const priceSymbol = priceArray[0];
    const largeNumber = priceArray[1];
    let change;
    if (priceArray[3]) {
      change = priceArray[2] + priceArray[3];
    }

    return (
      <div className={styles.optionPrice}>
        <span className={cn("h6", styles.priceSymbol)}>{priceSymbol}</span>
        <span className={cn("h2", styles.price)}>{largeNumber}</span>
        <div className={styles.changeCol}>
          {change && <span className={cn("h6", styles.change)}>{change}</span>}
          <div className={styles.perMonth}>/mo</div>
        </div>
      </div>
    );
  };

  // Display for the Free Plan Card Operations/month
  const renderFreeOption = (
    <>
      <div className={cn("small", styles.operationsContainer)}>
        <span>{renderOperations}</span> {operationsText}
      </div>
      {upgradeButton?.slug && (
        <Link
          className={cn("button secondary", styles.cardActionButton)}
          link={upgradeButton}
          external={true}
        />
      )}
      {requestDemoLink}
    </>
  );

  // Render the dropdown and Upgrade button for plan Cards that
  // contain a custom dropdown
  const renderPlanOptions = !isEnterprise && (
    <>
      <DropdownPricing
        name={planName}
        control={control}
        setValue={setValue}
        optionsArray={pricingJSON}
        defaultValue={monthOrYearOperations}
        containerClassName={styles.pricingDropdown}
        pricingDisplay
        isMonthly={isMonthly}
        operationsText={operationsText}
        reachOutText={reachOutText}
        showMonthlyOperations={showMonthlyOperations}
      />
      {upgradeButton?.slug && (
        <Link
          className={cn(
            "button",
            currentPlan ? "gradient" : "secondary",
            styles.cardActionButton
          )}
          link={upgradeButton}
          external={true}
        />
      )}
      {requestDemoLink}
    </>
  );

  // Render the Enterprise Plan Card with different content
  const renderEnterpriseContent = (
    <div className={styles.enterpriseDescription}>
      <p
        className={cn("caption font-regular", styles.enterpriseSubdescription)}
      >
        {planSubdescription}
      </p>
      {enterpriseButton?.slug && (
        <Link
          className={cn("button white", styles.cardActionButton)}
          link={enterpriseButton}
          external={true}
        />
      )}
      <div className={cn(styles.linkWrapper, styles.enterpriseLinkWrapper)}>
        {demoRequestLink?.slug ? (
          <Link className="small bold" link={demoRequestLink} />
        ) : null}
      </div>
    </div>
  );

  // .map based on the features array passed through and renders
  // a properly styled list
  const featuresList = featuresArray.map((feature, index) => {
    return (
      <p key={index} className={styles.planFeature}>
        <span className={styles.checkMark}>
          <CheckMark />
        </span>
        <span>{feature}</span>
      </p>
    );
  });

  return (
    <>
      <div className={styles.planCardWrapper}>
        <div
          className={cn(
            styles.planCard,
            currentPlan ? styles.currentPlanCard : "",
            popularPlan ? styles.popularPlanCard : "",
            isEnterprise && styles.enterpriseCard
          )}
        >
          <div className={styles.planCardContent}>
            <div className={styles.cardHeader}>
              {(currentPlan || popularPlan) && (
                <div className={styles.currentPlan}>
                  <div className={cn("caption", styles.currentPlanTitle)}>
                    {headingText}
                  </div>
                </div>
              )}
            </div>
            <div
              className={cn(
                styles.planCardPriceBlock,
                isEnterprise && styles.enterprisePriceBlock
              )}
            >
              <p className={styles.planName}>{planName}</p>
              <p
                className={cn(
                  "caption font-regular",
                  styles.planUseDescription
                )}
              >
                {planUses}
              </p>
              {!isEnterprise && (
                <div className={styles.planCardPrice}>
                  {renderOptionPrice(price)}
                </div>
              )}
              <p className={cn("small", styles.priceDescription)}>
                {priceDescription}
              </p>
            </div>
            {/* depending on the card, render the correct content */}
            {isFree && renderFreeOption}
            {!isFree && !isEnterprise && renderPlanOptions}
            {isEnterprise && renderEnterpriseContent}
            <div
              className={cn(
                showDetails ? "" : styles.hideDetails,
                styles.desktopDetails
              )}
            >
              <hr />
              <div className={cn("small", styles.planFeatures)}>
                <div className={styles.planFeaturesTitle}>
                  <ReactMarkdown>{planFeaturesTitle}</ReactMarkdown>
                </div>
                {featuresList}
              </div>
            </div>
            <div
              className={!showDetails ? styles.showDetails : styles.hideDetails}
              onClick={() => setShowDetails(!showDetails)}
              onKeyPress={() => setShowDetails(!showDetails)}
              role="button"
              tabIndex={0}
            >
              <span>{seeDetailsText}</span>
              <div
                className={cn(
                  styles.iconWrapper,
                  showDetails && styles.detailsOpen
                )}
              >
                <NextIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

PlanCard.propTypes = propTypes;

export default PlanCard;
