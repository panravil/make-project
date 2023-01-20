import styles from "./Form.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import ReactStars from "react-rating-stars-component";

const propTypes = {
  name: PropTypes.string.isRequired,
  // type: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  validations: PropTypes.object.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

// Component that renders the Request Demo form and handles submitting data
const PartnerForm = ({
  name,
  control,
  validations,
  className,
  label,
  value,
  setValue,
  errors,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={validations}
      render={() => (
        <div className={cn(className ? className : "", styles.ratingInput)}>
          <div className={styles.label}>
            {label}
            {_.get(validations, "required") ? "*" : ""}
          </div>
          <ReactStars
            activeColor="#ff9900"
            size={24}
            value={value}
            onChange={(rating) => {
              setValue(name, rating, { shouldValidate: true });
            }}
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

PartnerForm.propTypes = propTypes;

export default PartnerForm;
