import styles from "./Form.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import SearchIcon from "@icons/SearchIcon";

const propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  validations: PropTypes.object.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  errors: PropTypes.object,
  trigger: PropTypes.func,
  search: PropTypes.bool,
  gradient: PropTypes.bool,
};

const Input = ({
  name,
  type,
  register,
  placeholder,
  validations,
  className,
  label,
  value,
  errors,
  trigger,
  search,
  gradient,
}) => {
  // Custom form input for use with react hook forms
  const renderInput = (
    <input
      {...register(name, {
        ...validations,
        onBlur: () => {
          trigger && trigger(name);
        },
      })}
      id={name}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder || label}
      className={cn(
        gradient ? styles.gradientInputSelect : "",
        errors && errors[name] && styles.errorInput
      )}
    />
  );

  return (
    <div
      className={cn(
        styles.formElementWrapper,
        search ? styles.search : "",
        className ? className : ""
      )}
    >
      {/* If there is a label, display the label and connect it to the form */}
      {label ? (
        <label htmlFor={name}>
          {label}
          {_.get(validations, "required") ? "*" : ""}
        </label>
      ) : null}
      <div className={styles.formInput}>
        {gradient ? (
          <div className={styles.gradientBorder}>
            <div className={styles.gradientWrapper}>{renderInput}</div>
          </div>
        ) : (
          renderInput
        )}
        {/* If search Boolean passed through, display the icon */}
        {search && (
          <div className={styles.searchIcon}>
            <SearchIcon />
          </div>
        )}
      </div>
      {errors && errors[name] && (
        <div className={cn("small", styles.errorMessage)}>
          {errors[name].message}
        </div>
      )}
    </div>
  );
};

Input.propTypes = propTypes;

export default Input;
