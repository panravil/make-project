import styles from "./PageForm.module.scss";
import { useEffect, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";

import { Checkbox, Input, Dropdown, TextArea, Modal } from "@components/common";

const propTypes = {
  fields: PropTypes.shape({
    formTitle: PropTypes.string.isRequired,
    helpDropdownOptions: PropTypes.array.isRequired,
    planDropdownOptions: PropTypes.array.isRequired,
    helpDropdownOptionsShowPlanOptions: PropTypes.array.isRequired,
    countries: PropTypes.array.isRequired,
    jobTitles: PropTypes.array.isRequired,
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
    register,
    control,
    watch,
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
    countries,
    jobTitles,
  } = fields;
  const helpOptionArray = _.get(fields, "helpDropdownOptions");
  const showPlanDropdownOptions = _.get(
    fields,
    "helpDropdownOptionsShowPlanOptions"
  );

  const planOptionArray = _.get(fields, "planDropdownOptions");
  const countriesArray = _.sortBy(countries, "name").map((country) => {
    return country.name;
  });
  const jobTitleArray = _.sortBy(jobTitles, "name").map((jobTitle) => {
    return jobTitle.name;
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedCountryOption, setSelectedCountryOption] = useState("Country");
  const [selectedHelpOption, setSelectedHelpOption] = useState(
    "Please select from dropdown"
  );
  const [selectedPlanOption, setSelectedPlanOption] = useState(
    "Please select from dropdown"
  );
  const [selectedJobTitleOption, setSelectedJobTitleOption] = useState("Role");

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const [jobTitleDropdownOpen, setJobTitleDropdownOpen] = useState(false);

  // Set up a watch that will control if the Plans Dropdown exists based on help options
  const helpDropdownContent = watch("help");
  useEffect(() => {
    if (showPlanDropdownOptions.includes(helpDropdownContent)) {
      setShowPlanDropdown(true);
    } else {
      if (showPlanDropdown) {
        setShowPlanDropdown(false);
        setSelectedPlanOption("Please select from dropdown");
        setValue("plan", undefined);
      }
    }
  }, [helpDropdownContent]);

  // function for handlinghelp option is selected
  const selectOptionHandler = (name, option, toggleDropdown = true) => {
    if (name === "country") {
      setCountryDropdownOpen(!countryDropdownOpen);
      setSelectedCountryOption(option);
    }
    if (name === "help") {
      setHelpDropdownOpen(!helpDropdownOpen && toggleDropdown);
      setSelectedHelpOption(option);
    }
    if (name === "plan") {
      setPlanDropdownOpen(!planDropdownOpen);
      setSelectedPlanOption(option);
    }
    if (name === "jobTitle") {
      setJobTitleDropdownOpen(!jobTitleDropdownOpen);
      setSelectedJobTitleOption(option);
    }
    setValue(name, option, { shouldValidate: true });
  };

  const { query } = useRouter();

  useEffect(() => {
    if (query.help && helpOptionArray && helpOptionArray.includes(query.help)) {
      selectOptionHandler("help", query.help, false);
    }
  }, [query]);

  // Submit handler for the form
  const onSubmit = (data, event) => {
    event.preventDefault();
    const processedData = data;
    const countryObject = _.find(countries, (country) => {
      return country.name === data.country;
    });
    processedData.country = countryObject.value;
    const jobTitleObject = _.find(jobTitles, (jobTitle) => {
      return jobTitle.name === data.jobTitle;
    });
    processedData.jobTitle = jobTitleObject.value;
    // Function to encode data to send through fetch
    fetch(submitWebHook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processedData),
    })
      .then(() => {
        setShowModal(true);
        setSelectedCountryOption("Country");
        setSelectedHelpOption("Please select from dropdown");
        setSelectedPlanOption("Please select from dropdown");
        setSelectedJobTitleOption("Role");
        reset();
      })
      .catch((err) => alert(err));
  };

  return (
    <div
      data-cy="PageForm"
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
        <form name="pageForm" onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.row}>
            <Input
              name="firstName"
              type="text"
              label="First name*"
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
              label="Last name*"
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
            label="Work email*"
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
              label="Phone number*"
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
            <Dropdown
              name="country"
              label="Country*"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
              selectedOption={selectedCountryOption}
              selectOptionHandler={selectOptionHandler}
              dropdownOpen={countryDropdownOpen}
              setDropdownOpen={setCountryDropdownOpen}
              optionsArray={countriesArray}
              control={control}
            />
          </div>
          <Dropdown
            name="help"
            label="How can we help you?*"
            errors={errors}
            errorMessage="Please select an option"
            labelClassName={styles.dropdownLabel}
            selectedOption={selectedHelpOption}
            selectOptionHandler={selectOptionHandler}
            dropdownOpen={helpDropdownOpen}
            setDropdownOpen={setHelpDropdownOpen}
            optionsArray={helpOptionArray}
            control={control}
          />
          {showPlanDropdown && (
            <Dropdown
              name="plan"
              label="What plans are you interested in?*"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              selectedOption={selectedPlanOption}
              selectOptionHandler={selectOptionHandler}
              dropdownOpen={planDropdownOpen}
              setDropdownOpen={setPlanDropdownOpen}
              optionsArray={planOptionArray}
              control={control}
            />
          )}
          <div className={styles.row}>
            <Input
              name="company"
              type="text"
              label="Company name*"
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
              label="Job title*"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
              selectedOption={selectedJobTitleOption}
              selectOptionHandler={selectOptionHandler}
              dropdownOpen={jobTitleDropdownOpen}
              setDropdownOpen={setJobTitleDropdownOpen}
              optionsArray={jobTitleArray}
              control={control}
            />
          </div>
          <TextArea
            name="notes"
            type="text"
            label="Notes"
            placeholder="Notes"
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
