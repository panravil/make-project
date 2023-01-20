import styles from "./Form.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import _ from "lodash";

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
};

// Text Area component that can be styled and hooked into register
// and has error handling
const TextArea = ({
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
}) => {
  return (
    <div className={cn(styles.formElementWrapper, className ? className : "")}>
      {/* If there is a label, display the label and connect it to the form */}
      {label ? (
        <label htmlFor={name}>
          {label}
          {_.get(validations, "required") ? "*" : ""}
        </label>
      ) : null}
      <div className={styles.formInput}>
        <textarea
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
          className={errors && errors[name] && styles.errorInput}
        />
      </div>
      {errors && errors[name] && (
        <div className={cn("small", styles.errorMessage)}>
          {errors[name].message}
        </div>
      )}
    </div>
  );
};

TextArea.propTypes = propTypes;

export default TextArea;
