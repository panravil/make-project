import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import cn from "classnames";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styles from "../Form.module.scss";
import loadjs from "loadjs";

import {
  Checkbox,
  Dropdown,
  DropdownSearch,
  Input,
  InputFile,
  Modal,
  TextArea,
} from "@components/common";
import countries from "../json/countries.json";
import helpOptions from "./json/helpOptions.json";
import jobTitles from "../json/jobTitles.json";
import ngoOrNpoOptions from "./json/ngoOrNpoOptions.json";
import planOptions from "./json/planOptions.json";
import showPlanOptions from "./json/showPlanOptions.json";
import states from "../json/states-us.json";

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

// Component that renders the Request Demo form and handles submitting data
const PageForm = ({ fields }) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    trigger,
    watch,
  } = useFormContext();

  const {
    agreementText,
    consentText,
    formTitle,
    submissionModalText,
    submitButtonText,
    submitWebHook,
  } = fields;
  const [showModal, setShowModal] = useState(false);
  const [showNGOFields, setShowNGOFields] = useState(false);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [showStatesDropdown, setStatesPlanDropdown] = useState(false);
  const [notesPlaceholder, setNotesPlaceholder] = useState("");
  const [notesRequired, setNotesRequired] = useState(false);

  useEffect(() => {
    const scriptSrc = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;

    loadjs(scriptSrc, () => {});

    return () => {
      const head = document.getElementsByTagName("head")[0];
      const body = document.getElementsByTagName("body")[0];
      const gScript = head.querySelector(`script[src="${scriptSrc}"]`);
      const gBadge = body.querySelector("div div.grecaptcha-badge");
      if (gScript) {
        head.removeChild(gScript);
      }
      if (gBadge) {
        gBadge.parentNode.removeChild(gBadge);
      }
    };
  }, []);

  // Set up a watch that will control if the Plans Dropdown exists based on help options
  useEffect(() => {
    const selectedHelp = watch("help");
    if (showPlanOptions.includes(selectedHelp)) {
      setShowPlanDropdown(true);
    } else {
      setShowPlanDropdown(false);
      setValue("plan", null);
    }

    if (ngoOrNpoOptions.includes(selectedHelp)) {
      setShowNGOFields(true);
    } else {
      setShowNGOFields(false);
    }

    if (selectedHelp === "Become a technology partner") {
      setNotesPlaceholder(
        "Tell us more about your business, customers, interests or any additional info."
      );
      setNotesRequired(true);
    } else {
      setNotesPlaceholder("");
      setNotesRequired(false);
    }
  }, [showPlanOptions, watch("help")]);

  // Set up a watch that will control if the States Dropdown exists based on Country options
  useEffect(() => {
    const selectedCountry = watch("country");
    if (selectedCountry && selectedCountry.includes("US")) {
      setStatesPlanDropdown(true);
    } else {
      setStatesPlanDropdown(false);
    }
  }, [showStatesDropdown, watch("country")]);

  const { query } = useRouter();

  useEffect(() => {
    if (query.help && helpOptions.includes(query.help)) {
      setValue("help", query.help);
    }
  }, [query]);

  // Submit handler for the form
  const onSubmit = (data, event) => {
    event.preventDefault();

    if (typeof window.grecaptcha !== "undefined") {
      window.grecaptcha.ready(function () {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
            action: "submit",
          })
          .then(function (token) {
            // Function to encode data to send through fetch

            const fileKey = "NGOorNPOCertification";
            const helpKey = "help";
            let helpType = null;

            const formData = new FormData();

            for (const key in data) {
              if (key === helpKey) {
                helpType = data[key];
              }
              if (key === fileKey) {
                continue;
              }
              formData.append(key, data[key]);
            }

            if (data[fileKey] && data[fileKey].length) {
              formData.append(fileKey, data[fileKey][0]);
            } else if (helpType === "Apply for NGO program") {
              setError(
                fileKey,
                { type: "focus", message: "Please insert NPO or NGO file." },
                { shouldFocus: true }
              );
              return;
            }

            formData.append("gRecaptcha", token);

            fetch(submitWebHook, {
              method: "POST",
              body: formData,
            })
              .then(() => {
                setShowModal(true);
                reset();
              })
              .catch((err) => alert(err));
          });
      });
    }
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
        <form
          name="contactForm"
          onSubmit={handleSubmit(onSubmit)}
          method="POST"
          encType="multipart/form-data"
        >
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
          <div className={styles.row}>
            <Input
              className={cn(styles.phoneNumber)}
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
            <DropdownSearch
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
          {showStatesDropdown && (
            <Dropdown
              name="state"
              label="State"
              control={control}
              setValue={setValue}
              optionsArray={states}
              placeholder="State"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          )}
          <Dropdown
            name="help"
            label="How can we help you?"
            control={control}
            setValue={setValue}
            optionsArray={helpOptions}
            placeholder="Please select"
            errors={errors}
            errorMessage="Please select an option"
            labelClassName={styles.dropdownLabel}
            containerClassName={styles.dropdownContainer}
          />
          {showPlanDropdown && (
            <Dropdown
              name="plan"
              label="What plans are you interested in?"
              control={control}
              setValue={setValue}
              optionsArray={planOptions}
              placeholder="Please select"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
            />
          )}
          {showNGOFields && (
            <>
              <Input
                name="companyWebsite"
                type="url"
                label="Link to Company Website"
                placeholder="URL to your website"
                register={register}
                errors={errors}
                validations={{
                  required: "Please enter Company Website URL",
                }}
              />
              <InputFile
                className={styles.fileInput}
                name="NGOorNPOCertification"
                type="file"
                label="NGO Certification"
                placeholder="Place your file here"
                register={register}
                errors={errors}
                validations={{
                  required: "Please add NGO Certification file",
                }}
              />
              <Input
                name="makeAccountEmail"
                type="email"
                label="Email address of your Make account"
                placeholder="Or take 1 min to register a new free account"
                register={register}
                errors={errors}
                validations={{
                  required: "Please enter a valid Make email address",
                }}
              />
            </>
          )}
          <div className={styles.row}>
            <Input
              name="company"
              type="text"
              label="Company name"
              placeholder="Company name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your company name",
              }}
            />
            <Dropdown
              name="jobTitle"
              label="Job title"
              control={control}
              setValue={setValue}
              optionsArray={jobTitles}
              placeholder="Please select"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <TextArea
            name="notes"
            type="text"
            label="Notes"
            placeholder={notesPlaceholder}
            register={register}
            errors={errors}
            trigger={trigger}
            validations={{
              required: notesRequired,
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
