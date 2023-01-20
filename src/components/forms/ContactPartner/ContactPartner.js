import styles from "../Form.module.scss";
import { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";

import { Checkbox, Input, Dropdown, TextArea, Modal } from "@components/common";
import countries from "../json/countries.json";

const propTypes = {
  fields: PropTypes.shape({
    formTitle: PropTypes.string.isRequired,
    consentText: PropTypes.string,
    submitButtonText: PropTypes.string.isRequired,
    submitWebHook: PropTypes.string.isRequired,
    submissionModalText: PropTypes.string.isRequired,
    agreementText: PropTypes.string,
  }).isRequired,
  partner: PropTypes.string,
  setShowParentModal: PropTypes.func,
};

// Component that renders the Contact Partner form and handles submitting data
const PageForm = ({ fields, partner, setShowParentModal }) => {
  const {
    register,
    control,
    // watch,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    trigger,
  } = useFormContext();

  const {
    formTitle,
    consentText,
    submitButtonText,
    submitWebHook,
    submissionModalText,
    agreementText,
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
          <Modal
            setShowModal={setShowModal}
            setShowParentModal={setShowParentModal}
          >
            {submissionModalText}
          </Modal>
        ) : null}
        <div className={cn("h4", styles.formTitle)}>{formTitle}</div>
        <form name="contactPartnerForm" onSubmit={handleSubmit(onSubmit)}>
          {partner?.name ? (
            <Input
              name="inquiry_form"
              type="hidden"
              value={partner?.name}
              register={register}
              errors={errors}
              trigger={trigger}
              // validations={{
              //   required: "Please enter your first name",
              // }}
            />
          ) : null}
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
          <div className={styles.row}>
            <Input
              name="company"
              type="text"
              label="Company"
              placeholder="Your company"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: false,
              }}
            />
            <Dropdown
              name="companySize"
              label="Company size"
              control={control}
              setValue={setValue}
              optionsArray={["1-15", "15-20", "50-200", "200 - above"]}
              placeholder="Your Company Size"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <div className={styles.row}>
            <Input
              name="industry"
              type="text"
              label="Industry"
              placeholder="Your Industry"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: false,
              }}
            />
            <Dropdown
              name="experience"
              label="Experience"
              control={control}
              setValue={setValue}
              optionsArray={[
                "Novice",
                "Advanced Beginner",
                "Competent",
                "Proficient",
                "Expert",
              ]}
              placeholder="Your Experience"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <div className={styles.row}>
            <Input
              name="email"
              type="email"
              label="Work email"
              placeholder="Your Work Email"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter a valid email address",
                // If we want to have control of the email validation vs letting the browser handle it
                // pattern: {
                //   value: new RegExp(
                //     `([-!#-'*+/-9=?A-Z^-~]+(.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ t]|(\\[t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+`
                //   ),
                //   message: "Please enter a valid email address",
                // },
              }}
            />
            <Input
              // className={cn(styles.phoneNumber)}
              name="phone"
              type="tel"
              label="Phone number"
              placeholder="Your Phone Number"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter a valid phone number",
                pattern: {
                  value:
                    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                  message:
                    "Please enter a valid phone number in the format +1 (234) 567-8999, 00420 123 456 789 etc.",
                },
              }}
            />
          </div>
          <div className={styles.row}>
            <Dropdown
              name="communication"
              label="Prefered communication channel"
              control={control}
              setValue={setValue}
              optionsArray={["Phone", "Whatsapp", "Email"]}
              placeholder="Your prefered communication channel"
              errors={errors}
              errorMessage="Please enter your prefered communication channel"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Dropdown
              name="plan"
              label="Make plan"
              control={control}
              setValue={setValue}
              optionsArray={[
                "No, I don't have an account",
                "Free",
                "Core",
                "Pro",
                "Teams",
                "Enterprise",
              ]}
              placeholder="Please select"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <div className={styles.row}>
            <Input
              name="website"
              type="url"
              label="Website"
              placeholder="Your Website"
              register={register}
              errors={errors}
              trigger={trigger}
            />
            <Dropdown
              name="country"
              label="Country"
              control={control}
              setValue={setValue}
              optionsArray={countries}
              placeholder="Country"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <TextArea
            name="projectDescription"
            type="text"
            label="Project description"
            placeholder="Your project description"
            register={register}
            errors={errors}
            trigger={trigger}
            validations={{
              required: "Please enter your project description",
            }}
          />
          <div className={styles.row}>
            <Dropdown
              name="projectDuration"
              label="Project duration"
              control={control}
              setValue={setValue}
              optionsArray={["One-time help", "Ongoing support"]}
              placeholder="Your project duration"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Input
              name="deliveryTimeframe"
              type="date"
              label="Delivery timeframe"
              placeholder="Your delivery timeframe"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your delivery timeframe",
              }}
            />
          </div>
          <Input
            name="budget"
            type="text"
            label="Budget in USD"
            placeholder="Your budget in USD"
            register={register}
            errors={errors}
            trigger={trigger}
            validations={{
              required: false,
            }}
          />
          <TextArea
            name="apps"
            type="text"
            label="Apps needed to connect"
            placeholder="Your apps needed to connect"
            register={register}
            errors={errors}
            trigger={trigger}
            validations={{
              required: false,
            }}
          />
          <TextArea
            name="notes"
            type="text"
            label="Tell us more about your needs"
            placeholder="Tell us more about your needs"
            register={register}
            errors={errors}
            trigger={trigger}
            validations={{
              required: false,
            }}
          />
          {consentText ? (
            <Checkbox
              name={"consent"}
              errors={errors}
              control={control}
              setValue={setValue}
              optional
            >
              {consentText}
            </Checkbox>
          ) : null}
          <button className={"gradient full-width"} type="submit">
            {submitButtonText}
          </button>
        </form>
        {agreementText ? (
          <div className={cn("small", styles.agreementText)}>
            <ReactMarkdown>{agreementText}</ReactMarkdown>
          </div>
        ) : null}
      </section>
    </div>
  );
};

PageForm.propTypes = propTypes;

export default PageForm;
