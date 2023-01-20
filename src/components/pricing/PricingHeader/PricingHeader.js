import { useState } from "react";
import styles from "./PricingHeader.module.scss";
import PropTypes from "prop-types";
import cn from "classnames";

const propTypes = {
  setIsMonthly: PropTypes.func.isRequired,
  pricingData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    showPlansLabel: PropTypes.string.isRequired,
    annualLabel: PropTypes.string.isRequired,
    monthLabel: PropTypes.string.isRequired,
  }).isRequired,
};

// Header component for the pricing page
const PricingHeader = ({ setIsMonthly, pricingData }) => {
  const { annualLabel, monthLabel } = pricingData;
  const monthOrYearOptionsArray = [annualLabel, monthLabel];
  const [selectedOption, setSelectedOption] = useState(annualLabel);

  // function for handling what option is selected
  const selectOptionHandler = (event) => {
    const isMonthly = event.target.id === pricingData.monthLabel ? true : false;
    setIsMonthly(isMonthly);
    setSelectedOption(event.target.id);
  };

  // Map to render the drop down options
  const renderIncrementOptions = monthOrYearOptionsArray.map(
    (option, index) => {
      return (
        <div
          id={option}
          className={cn(
            "h6",
            styles.tabTitle,
            selectedOption === option && styles.selectedTab
          )}
          key={index}
          onClick={selectOptionHandler}
          onKeyPress={selectOptionHandler}
          role="button"
          tabIndex={0}
        >
          {option}
        </div>
      );
    }
  );

  return (
    <div className={cn("container", styles.pricingHeader)}>
      <div className={styles.titleDescriptionWrapper}>
        <h1 className={styles.pricingTitle}>{pricingData.title}</h1>
        <p className={cn("h6", styles.pricingDescription)}>
          {pricingData.description}
        </p>
      </div>
      <div className={styles.monthOrYearContainer}>
        <p className={cn("small", styles.showPlansLabel)}>
          {pricingData.showPlansLabel}
        </p>
        <div className={styles.optionsContainer}>{renderIncrementOptions}</div>
      </div>
    </div>
  );
};

PricingHeader.propTypes = propTypes;

export default PricingHeader;
