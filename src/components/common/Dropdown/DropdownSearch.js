import styles from "./Dropdown.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

import SelectSearch from "react-select-search";

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
};

// Component that handles the styling of the dropdowns on the pricing page
const DropdownSearch = ({
  // NECESSARY FOR ALL
  name,
  control,
  setValue,
  optionsArray = [],
  // OPTIONAL FIELDS
  defaultValue,
  placeholder = "Please select from dropdown",
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
}) => {
  if (multiselect) {
    defaultValue = null;
  }

  const onValueChange = (value) => {
    setValue(name, value, { shouldValidate: true });
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue?.value || defaultValue}
      rules={{ required: errorMessage }}
      render={({ field: { name, value } }) => (
        <div className={cn(errors && errors[name] && "form-error")}>
          <p className="select-search-label">
            {label}
            {errorMessage ? "*" : ""}
          </p>
          <SelectSearch
            autoComplete="on"
            label={label}
            name={name}
            options={optionsArray}
            placeholder={placeholder}
            search
            value={value}
            onChange={onValueChange}
          />
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

DropdownSearch.propTypes = propTypes;

export default DropdownSearch;
