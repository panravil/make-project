import styles from "../Form.module.scss";
import styles2 from "../../common/Form/Form.module.scss";
import { useState, useEffect } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import moment from "moment-timezone";

import {
  Checkbox,
  Input,
  Dropdown,
  DropdownSearch,
  TextArea,
  Modal,
} from "@components/common";
import countries from "../json/countries.json";
import languages from "../json/languages.json";
import industries from "../json/industries.json";
import jobTitles from "../json/jobTitles.json";
import states from "../json/states-us-partners.json";

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
    formSubmitted,
  } = fields;

  const [showModal, setShowModal] = useState(false);
  const [showLStatesDropdown, setLStatesDropdown] = useState(false);
  const [showPStatesDropdown, setPStatesDropdown] = useState(false);

  useEffect(() => {
    const selectedLCountry = watch("L_Country");
    if (selectedLCountry && selectedLCountry.includes("US")) {
      setLStatesDropdown(true);
    } else {
      setLStatesDropdown(false);
    }
  }, [showLStatesDropdown, watch("L_Country")]);

  useEffect(() => {
    const selectedPCountry = watch("P_Country");
    if (selectedPCountry && selectedPCountry.includes("US")) {
      setPStatesDropdown(true);
    } else {
      setPStatesDropdown(false);
    }
  }, [showPStatesDropdown, watch("P_Country")]);

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
        <form name="ORFForm" onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.row}>
            <p>
              If you are a Make partner already, please register the opportunity
              in the{" "}
              <a href="https://partnerportal.integromat.com/aspx/PublicPartnerProgram">
                Make partner portal
              </a>
              .
            </p>
          </div>
          <div className={styles.row}>
            <Dropdown
              name="P_partner"
              label="Are you a Make partner already?"
              control={control}
              setValue={setValue}
              optionsArray={["Yes", "No"]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <h5>
            <b>About your company</b>{" "}
          </h5>
          <div className={styles.row}>
            <Input
              name="P_FirstName"
              type="text"
              label="First name"
              placeholder="Your first name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your first name",
              }}
            />
            <Input
              name="P_LastName"
              type="text"
              label="Last name"
              placeholder="Your last name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your last name",
              }}
            />
          </div>
          <div className={styles.row}>
            <Dropdown
              name="P_Title"
              label="Position or role"
              control={control}
              setValue={setValue}
              optionsArray={jobTitles}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Input
              name="P_Email"
              type="email"
              label="Email address"
              placeholder="Email address"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter a valid email address",
              }}
            />
          </div>
          <div className={styles.row}>
            <Input
              name="P_Phone"
              type="tel"
              label="Phone number"
              placeholder="Your phone number"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: false,
                pattern: {
                  value:
                    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
                  message:
                    "Please enter a valid phone number in the format +1 (234) 567-8999, 00420 123 456 789 etc.",
                },
              }}
            />

            <Input
              name="P_Company"
              type="text"
              label="Company"
              placeholder="Your company"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your company name",
              }}
            />
          </div>
          <div className={styles.row}>
            <Input
              name="P_Website"
              type="url"
              label="Website"
              placeholder="Your website"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your website url",
              }}
            />
            <DropdownSearch
              name="P_Country"
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
          <div className={styles.row}>
            <Input
              name="P_City"
              type="text"
              label="City"
              placeholder="Your city"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your city name",
              }}
            />
            {showPStatesDropdown ? (
              <DropdownSearch
                name="P_State"
                label="US State"
                control={control}
                setValue={setValue}
                optionsArray={states}
                errors={errors}
                placeholder="Please select"
                errorMessage="Please select an option"
                labelClassName={styles.dropdownLabel}
                containerClassName={styles.dropdownContainer}
              />
            ) : (
              <div className={styles2.formElementWrapper}></div>
            )}
          </div>
          <div className={styles.row}>
            <Input
              name="P_PostalCode"
              type="text"
              label="Postal code"
              placeholder="Your postal code"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your postal code",
              }}
            />
            <Input
              name="P_Street"
              type="text"
              label="Street"
              placeholder="Your street name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your street name",
              }}
            />
          </div>
          <div className={styles.row}>
            <TextArea
              name="P_imt_Partner_Company_Bio__c"
              type="text"
              label="Company bio"
              placeholder="Company bio"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your company bio",
              }}
            />

            <Dropdown
              name="P_industry"
              label="Industry / Sector"
              control={control}
              setValue={setValue}
              optionsArray={industries}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <div className={styles.row}>
            <Dropdown
              name="P_numberOfEmployees__c"
              label="Number of employees"
              control={control}
              setValue={setValue}
              optionsArray={[
                "Self-employed",
                "2-10",
                "11-50",
                "51-100",
                "101-200",
                "200 above",
              ]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Dropdown
              name="P_imt_Partner_Last_Year_Revenue_USD__c"
              label="Estimated revenue from your last year in USD?"
              control={control}
              setValue={setValue}
              optionsArray={[
                "0-100k",
                "100k-500k",
                "500k-5M",
                "5M +",
              ]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <div className={styles.row}>
            <Dropdown
              name="P_imt_Partner_Years_Of_Establishment__c"
              label="How long has the company been established?"
              control={control}
              setValue={setValue}
              optionsArray={[
                "Less than 1 year",
                "1-3 years",
                "3-10 years",
                "More than 10 years",
              ]}
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Dropdown
              name="P_Languages_Operated_in__c"
              label="Operating languages"
              control={control}
              setValue={setValue}
              optionsArray={languages}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
              multiselect
            />
          </div>
          <div className={styles.row}>
            <Dropdown
              name="P_imt_Partner_Current_Integromat_Usage__c"
              label="Are you currently using Make?"
              control={control}
              setValue={setValue}
              optionsArray={[
                "No, not actively",
                "Yes, less than 6 months",
                "Yes, for over 6 months",
              ]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Dropdown
              name="L_imt_Partner_Sales_Involvement__c"
              label="Involvement in opportunity"
              control={control}
              setValue={setValue}
              optionsArray={[
                "Lead Sourcing",
                "Co-Selling",
                "Delivering Services",
              ]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
              multiselect
              hintMessage="By submitting this form you are considered as the lead source, if you want to engage in the sales process with our team and the end customer or if you plan to deliver services to the end customer after the deal is successfully closed please select the respective option."
            />
          </div>
          <h5>
            <b>About the opportunity</b>
          </h5>
          <div className={styles.row}>
            <Input
              name="L_Company"
              type="text"
              label="Company name"
              placeholder="Company name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter the company name",
              }}
            />
            <Input
              name="L_Website"
              type="url"
              label="Company website"
              placeholder="Company website"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your first name",
              }}
            />
          </div>
          <div className={styles.row}>
            <Dropdown
              name="L_Industry"
              label="Company industry"
              control={control}
              setValue={setValue}
              optionsArray={industries}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <DropdownSearch
              name="L_Country"
              label="Company country"
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
          <div className={styles.row}>
            {showLStatesDropdown ? (
              <DropdownSearch
                name="L_State"
                label="US State"
                control={control}
                setValue={setValue}
                optionsArray={states}
                errors={errors}
                placeholder="Please select"
                errorMessage="Please select an option"
                labelClassName={styles.dropdownLabel}
                containerClassName={styles.dropdownContainer}
              />
            ) : (
              <div className={styles2.formElementWrapper}></div>
            )}
            <Dropdown
              name="L_NumberOfEmployees__c"
              label="Company size"
              control={control}
              setValue={setValue}
              optionsArray={[
                "Self-employed",
                "2-10",
                "11-50",
                "51-100",
                "101-200",
                "201-500",
                "501-1000",
                "1000 above",
              ]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <div className={styles.row}>
            <Input
              name="L_FirstName"
              type="text"
              label="First name"
              placeholder="Your first name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter your first name",
              }}
            />
            <Input
              name="L_LastName"
              type="text"
              label="Last name"
              placeholder="Your last name"
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
              name="L_Email"
              type="email"
              label="Email address"
              placeholder="Email address"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter a valid email address",
              }}
            />
            <Input
              name="L_Phone"
              type="tel"
              label="Company phone number"
              placeholder="Company phone number"
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
            <Input
              name="L_imt_Partner_Deal_Budget_Holder__c"
              type="text"
              label="Budget holder name"
              placeholder="Budget holder name"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter the budget holder name",
              }}
            />
            <Input
              name="L_imt_Partner_Expected_Close_Date__c"
              type="date"
              label="Expected close date"
              placeholder="Expected close date"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter the expected close date",
              }}
            />
          </div>
          <div className={styles.row}>
            <Input
              name="L_imt_Partner_Deal_Competition__c"
              type="Text"
              label="Competition on this deal"
              placeholder="Competition on this deal"
              register={register}
              errors={errors}
              trigger={trigger}
            />
            <Input
              name="L_Notes__c"
              type="Text"
              label="Any other relevant information or questions?"
              placeholder="Any other relevant information or questions?"
              register={register}
              errors={errors}
              trigger={trigger}
            />
          </div>
          <Input
            name="SubmissionDate"
            type="hidden"
            value={moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ")}
            register={register}
          />
          <Input
            name="L_Channel__c"
            type="hidden"
            value="Direct"
            register={register}
          />
          <Input
            name="L_imt_Make_Transaction_Channel__c"
            type="hidden"
            value="Sales-Led"
            register={register}
          />
          <Input
            name="L_imt_Make_Product_Solution__c"
            type="hidden"
            value="Enterprise"
            register={register}
          />
          <Input
            name="L_imt_Lead_Generation_Type__c"
            type="hidden"
            value="Inbound"
            register={register}
          />

          <Input
            name="P_imt_Partner_Partnership_Type__c"
            type="hidden"
            value="Co-selling Partners"
            register={register}
          />

          <Input
            name="P_imt_Type_of_Customer__c"
            type="hidden"
            value="Enterprise"
            register={register}
          />
          <Input
            name="P_imt_Partner_Main_Services__c"
            type="hidden"
            value="Other"
            register={register}
          />
          <Input
            name="P_imt_Partner_Source__c"
            type="hidden"
            value="ORF form"
            register={register}
          />
          <Input
            name="imt_Lead_Source_Type__c"
            type="hidden"
            value="ORF form"
            register={register}
          />
          <Input name="Status" type="hidden" value="New" register={register} />
          <Input
            name="LeadSource"
            type="hidden"
            value="IMT Ecosystem ORF"
            register={register}
          />
          <Input
            name="imt_gclid__c"
            type="hidden"
            value="null"
            register={register}
          />
          <Input
            name="imt_utm_term__c"
            type="hidden"
            value="null"
            register={register}
          />
          <Input
            name="imt_utm_medium__c"
            type="hidden"
            value="null"
            register={register}
          />
          <Input
            name="imt_utm_source__c"
            type="hidden"
            value="Make Partner"
            register={register}
          />
          <Input
            name="imt_utm_content__c"
            type="hidden"
            value="null"
            register={register}
          />
          <Input
            name="imt_utm_campaign__c"
            type="hidden"
            value="Partner Page ORF"
            register={register}
          />
          <Input
            name="imt_Last_Form_Submission_Date__c"
            type="hidden"
            value={formSubmitted}
            register={register}
          />
          <Input
            name="SubmissionDate"
            type="hidden"
            value={formSubmitted}
            register={register}
          />
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
