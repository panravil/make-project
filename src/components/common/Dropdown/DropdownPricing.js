import styles from "./Dropdown.module.scss";
import { useState } from "react";
import cn from "classnames";
import SelectArrow from "@icons/SelectArrow";
import _ from "lodash";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { DropdownOption } from "@components/common";

const propTypes = {
  // NECESSARY FOR ALL
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  optionsArray: PropTypes.array.isRequired,
  // AT LEAST ONE IS NEEDED FOR PROPER RENDER
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  // OPTIONAL FIELDS
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  /// FOR FUNCTIONAL FORMS
  errors: PropTypes.object,
  errorMessage: PropTypes.string,
  // FOR PRICING
  isMonthly: PropTypes.bool,
  operationsText: PropTypes.string.isRequired,
  reachOutText: PropTypes.string.isRequired,
  showMonthlyOperations: PropTypes.bool,
};

// Component that handles the styling of the dropdowns on the pricing page
const Dropdown = ({
  // NECESSARY FOR ALL
  name,
  control,
  setValue,
  optionsArray = [],
  // AT LEAST ONE IS NEEDED FOR PROPER RENDER
  defaultValue,
  placeholder,
  // OPTIONAL FIELDS
  label,
  labelClassName,
  containerClassName,
  /// FOR FUNCTIONAL FORMS
  errors,
  errorMessage,
  // FOR PRICING
  isMonthly,
  operationsText,
  reachOutText,
  showMonthlyOperations,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Function for toggling dropdown open or closed
  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }
  // Function to handle selet option and toggle dropdown
  function selectOptionHandler(name, option) {
    setValue(name, option?.value || option, { shouldValidate: true });
    toggleDropdown();
  }

  // Set the dropdown option render based on if it's a pricing
  // dropdown or a standard dropdown
  const renderDropdownOptions = optionsArray.map((option, index) => {
    // set month or year price based on isMonthly boolean
    const monthOrYearPrice = isMonthly
      ? option?.monthly?.price
      : option?.annually?.price;
    // set operations based on if it's ONLY monthly (free and core)
    // or set based on isMonthly boolean (for pro and teams)
    const monthOrYearOperations = showMonthlyOperations
      ? option?.monthly?.operations
      : isMonthly
      ? option?.monthly?.operations
      : option?.annually?.operations;
    // return the dropdown options with price rendering
    return (
      <DropdownOption
        key={index}
        name={name}
        option={monthOrYearOperations}
        selectOptionHandler={selectOptionHandler}
      >
        <span>
          <div className={styles.dropdownPrice}>{monthOrYearPrice}</div>
          <span className={styles.optionName}>
            {monthOrYearOperations} {operationsText}
          </span>
        </span>
      </DropdownOption>
    );
  });

  // Render the dropdown button with styling
  const renderDropdownButton = (value) => {
    const optionObject = _.find(optionsArray, (option) => {
      return option?.value === value;
    });
    const renderedName = optionObject?.name || value || placeholder;

    return (
      <div
        className={cn(
          "caption",
          styles.dropdownButton,
          dropdownOpen ? styles.dropdownOpen : "",
          errors && errors[name] && styles.errorButton
        )}
        onClick={toggleDropdown}
        onKeyPress={toggleDropdown}
        role="button"
        tabIndex={0}
      >
        <div className={styles.selectedContent}>
          <div
            className={cn(
              "small",
              styles.priceDropdown,
              !value ? styles.placeholder : ""
            )}
          >
            {renderedName || placeholder}{" "}
            <span className={styles.operations}>{operationsText}</span>
          </div>
        </div>
        <div className={cn(styles.iconContainer, styles.pricingIconContainer)}>
          <SelectArrow />
        </div>
      </div>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{ required: errorMessage }}
      render={({ field: { name, value } }) => (
        <div
          className={cn(
            styles.customDropdown,
            styles.pricingDisplay,
            containerClassName ? containerClassName : ""
          )}
        >
          {/* div to close the dropdown if clicked outside of dropdown menu while it is open */}
          {dropdownOpen && (
            <div
              role="none"
              className={styles.disabledArea}
              onClick={toggleDropdown}
            />
          )}
          <p className={cn(styles.label, labelClassName ? labelClassName : "")}>
            {label}
            {errorMessage ? "*" : ""}
          </p>
          {renderDropdownButton(value)}
          {/* if the dropdown is open, show the list of options */}
          {dropdownOpen && (
            <div className={styles.customDropdownList}>
              {renderDropdownOptions}
              {reachOutText && (
                <DropdownOption textOnly>{reachOutText}</DropdownOption>
              )}
            </div>
          )}
          {errors && errors[name] && (
            <div className={cn("small", styles.errorMessage)}>
              {errors[name].message}
            </div>
          )}
        </div>
      )}
    />
  );
};

Dropdown.propTypes = propTypes;

export default Dropdown;
