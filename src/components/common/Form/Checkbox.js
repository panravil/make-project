import styles from "./Form.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const propTypes = {
  /// FOR FUNCTIONAL FORMS
  setValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
  errorMessage: PropTypes.string,
  optional: PropTypes.bool,
};

// Component that handles the styling custom checkboxes
const Checkbox = ({
  /// FOR FUNCTIONAL FORMS
  setValue,
  name,
  children,
  errors,
  control,
  errorMessage,
  optional,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: { value: !optional, message: errorMessage } }}
      render={({ field: { value } }) => (
        <>
          <div className={styles.checkmarkRow}>
            <div
              role="button"
              aria-label={name}
              tabIndex={0}
              onKeyPress={() =>
                setValue(name, !value, { shouldValidate: true })
              }
              onClick={() => setValue(name, !value, { shouldValidate: true })}
              className={cn(
                styles.checkmark,
                errors && errors[name] && styles.checkmarkError
              )}
            >
              {value ? <FaCheckSquare /> : <FaRegSquare />}
            </div>
            <div className="small">
              <ReactMarkdown>{children}</ReactMarkdown>
            </div>
          </div>
          {errors && errors[name] && errorMessage && (
            <div
              className={cn(
                "small",
                styles.errorMessage,
                styles.checkboxErrorMessage
              )}
            >
              {errors[name].message}
            </div>
          )}
        </>
      )}
    />
  );
};

Checkbox.propTypes = propTypes;

export default Checkbox;
