import { Checkbox, Input, DropdownSearch, Modal } from "@components/common";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import cn from "classnames";
import countries from "../json/countries.json";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styles from "../Form.module.scss";

const propTypes = {
  fields: PropTypes.shape({
    formTitle: PropTypes.string.isRequired,
    consentText: PropTypes.string,
    submitButtonText: PropTypes.string.isRequired,
    submitWebHook: PropTypes.string.isRequired,
    submissionModalText: PropTypes.string.isRequired,
    agreementText: PropTypes.string,
  }).isRequired,
};

// Component that renders the Contact Partner form and handles submitting data
const PageForm = ({ fields }) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    trigger,
  } = useFormContext();

  const {
    agreementText,
    consentText,
    formSubmitted,
    formTitle,
    submissionModalText,
    submitButtonText,
    submitWebHook,
    webinarDate,
    webinarName,
    webinarUrl,
  } = fields;
  const [showModal, setShowModal] = useState(false);

  // Submit handler for the form
  const onSubmit = (data, event) => {
    event.preventDefault();
    // Function to encode data to send through fetch
    fetch(submitWebHook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        setShowModal(true);
        reset();
      })
      .catch((err) => alert(err));
  };

  return (
    <div
      className={cn(
        "container less-margin-horizontal",
        styles.requestFormContainer
      )}
    >
      <section className="white white-override">
        {showModal ? (
          <Modal setShowModal={setShowModal}>{submissionModalText}</Modal>
        ) : null}
        <div className={cn("h4", styles.formTitle)}>{formTitle}</div>
        <form name="becomePartnerForm" onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="webinarName"
            type="hidden"
            value={webinarName.trim()}
            register={register}
          />
          <Input
            name="webinarDate"
            type="hidden"
            value={webinarDate}
            register={register}
          />
          <Input
            name="webinarUrl"
            type="hidden"
            value={webinarUrl}
            register={register}
          />
          <Input
            name="formSubmitted"
            type="hidden"
            value={formSubmitted}
            register={register}
          />
          <div className={styles.row}>
            <Input
              name="firstName"
              type="text"
              label="First name"
              placeholder="Your First Name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your first name",
              }}
            />
            <Input
              name="lastName"
              type="text"
              label="Last name"
              placeholder="Your Last Name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your last name",
              }}
            />
          </div>
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="Your Email"
            register={register}
            errors={errors}
            trigger={trigger}
            validations={{
              required: "Please enter a valid email address",
            }}
          />
          <Input
            errors={errors}
            label="Company"
            name="company"
            placeholder="Your company"
            register={register}
            trigger={trigger}
            type="text"
            validations={{
              required: false,
            }}
          />
          <div className={styles.row}>
            <Input
              errors={errors}
              label="Job title"
              name="jobTitle"
              placeholder="Job title"
              register={register}
              type="text"
              trigger={trigger}
            />
            <DropdownSearch
              name="country"
              label="Country"
              control={control}
              setValue={setValue}
              optionsArray={countries}
              errors={errors}
              placeholder="Please select"
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>

          {consentText || agreementText ? (
            <Checkbox
              name={consentText ? "consent" : "agreement"}
              errors={errors}
              control={control}
              setValue={setValue}
              optional
            >
              {consentText ? consentText : agreementText}
            </Checkbox>
          ) : null}
          <button className={"gradient full-width"} type="submit">
            {submitButtonText}
          </button>
          {agreementText && consentText ? (
            <div className={cn("small", styles.agreementText)}>
              <ReactMarkdown>{agreementText}</ReactMarkdown>
            </div>
          ) : null}
        </form>
      </section>
    </div>
  );
};

PageForm.propTypes = propTypes;

export default PageForm;
