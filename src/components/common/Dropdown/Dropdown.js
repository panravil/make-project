import styles from "./Dropdown.module.scss";
import { useState } from "react";
import cn from "classnames";
import SelectArrow from "@icons/SelectArrow";
import _ from "lodash";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { DropdownOption } from "@components/common";
import CheckMark from "@icons/CheckMark";

const propTypes = {
  // NECESSARY FOR ALL
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  optionsArray: PropTypes.array.isRequired,
  // OPTIONAL FIELDS
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  /// FOR FUNCTIONAL FORMS
  errors: PropTypes.object,
  errorMessage: PropTypes.string,
  // SORT BY
  sortBy: PropTypes.bool,
  gradient: PropTypes.bool,
  // MULTISELECT
  multiselect: PropTypes.bool,
  // HELP TEXT
  hintMessage: PropTypes.string,
};

// Component that handles the styling of the dropdowns on the pricing page
const Dropdown = ({
  // NECESSARY FOR ALL
  name,
  control,
  setValue,
  optionsArray = [],
  // OPTIONAL FIELDS
  defaultValue,
  placeholder = "All categories",
  label,
  labelClassName,
  containerClassName,
  /// FOR FUNCTIONAL FORMS
  errors,
  errorMessage,
  // SORT BY
  sortBy,
  gradient,
  // MULTISELECT
  multiselect,
  // HELP TEXT
  hintMessage,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Function for toggling dropdown open or closed
  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  if (multiselect) {
    defaultValue = null;
  }

  // Function to handle selet option and toggle dropdown
  function selectOptionHandler(name, option, oldValue) {
    const selectedValue = option?.value || option;
    // If multiselect, turn prior value into an array for proper parsing
    // to either add or remove items from this.
    if (multiselect) {
      const valueArray = _.compact(_.split(oldValue, ", "));
      if (valueArray?.length === 0) {
        setValue(name, selectedValue, { shouldValidate: true });
      } else {
        let updatedValue;
        if (!(valueArray || []).includes(selectedValue)) {
          updatedValue = _.join([...valueArray, selectedValue], ", ");
        } else {
          updatedValue = _.join(
            _.filter(valueArray, (item) => {
              return item !== selectedValue;
            }),
            ", "
          );
        }
        setValue(name, updatedValue, { shouldValidate: true });
      }
    } else {
      setValue(name, selectedValue, { shouldValidate: true });
    }
    if (!multiselect) {
      toggleDropdown();
    }
  }

  const isOptionSelected = (selectedValue, optionValue) => {
    if (!selectedValue) {
      return false;
    }
    return (
      selectedValue === optionValue ||
      selectedValue.includes(`${optionValue},`) ||
      selectedValue.includes(`, ${optionValue}`) ||
      selectedValue.includes(optionValue?.value)
    );
  };

  // Set the dropdown option render
  const renderDropdownOptions = (value) => {
    return (
      <>
        {optionsArray.map((option, index) => {
          return (
            <DropdownOption
              key={index}
              name={name}
              option={option}
              value={value}
              selectOptionHandler={selectOptionHandler}
            >
              {multiselect ? (
                <>
                  {isOptionSelected(value, option) ? (
                    <div className={styles.checkmarkWrapper}>
                      <CheckMark />
                    </div>
                  ) : null}
                  <div className={styles.multiItem}>
                    {option?.name || option}
                  </div>
                </>
              ) : (
                <span className={styles.optionName}>
                  {option?.name || option}
                </span>
              )}
            </DropdownOption>
          );
        })}
      </>
    );
  };

  // Render the dropdown button with styling
  const renderDropdownButton = (value) => {
    // otherwise render the standard dropdown
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
          gradient ? styles.gradientInputSelect : "",
          errors && errors[name] && styles.errorButton
        )}
        onClick={toggleDropdown}
        onKeyPress={toggleDropdown}
        role="button"
        tabIndex={0}
      >
        <div className={styles.selectedContent}>
          <span className={!value ? styles.placeholder : ""}>
            {renderedName}
          </span>
        </div>
        <div className={styles.iconContainer}>
          <SelectArrow />
        </div>
      </div>
    );
  };

  const clearFilter = (e) => {
    e.preventDefault();
    setValue(name, "");
  }

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue?.value || defaultValue}
      rules={{ required: errorMessage }}
      render={({ field: { name, value } }) => (
        <div
          className={cn(
            styles.customDropdown,
            sortBy && styles.sortBy,
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
          <p
            className={cn(
              styles.label,
              sortBy && "caption",
              labelClassName ? labelClassName : ""
            )}
          >
            {label}
            {errorMessage ? "*" : ""}
          </p>
          {gradient ? (
            <div className={styles.gradientBorder}>
              <div className={styles.gradientWrapper}>
                {renderDropdownButton(value)}
              </div>
            </div>
          ) : (
            renderDropdownButton(value)
          )}
          {/* if the dropdown is open, show the list of options */}
          {dropdownOpen && (
            <div className={styles.customDropdownList}>
              <div className={styles.customDropdownListBody}>
                {renderDropdownOptions(value)}
              </div>
              <div className={styles.clearFilterButton}>
                <a onClick={clearFilter}>&times; Clear Filter</a>
              </div>
            </div>
          )}
          {errors && errors[name] && (
            <div className={cn("small", styles.errorMessage)}>
              {errors[name].message}
            </div>
          )}
          {hintMessage && (
            <div className={cn("small", styles.hintMessage)}>{hintMessage}</div>
          )}
        </div>
      )}
    />
  );
};

Dropdown.propTypes = propTypes;

export default Dropdown;
