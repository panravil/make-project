import styles from "../Form.module.scss";
import styles2 from "../../common/Form/Form.module.scss";
import { useState, useEffect } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useGrecaptcha } from "@utils/useGrecaptcha";
import {
  Checkbox,
  Input,
  Dropdown,
  DropdownSearch,
  TextArea,
  Modal,
} from "@components/common";
import countries from "../json/countries.json";
import industries from "../json/industries.json";
import jobTitles from "../json/jobTitles.json";
import languages from "../json/languages.json";
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
  } = fields;
  const [showModal, setShowModal] = useState(false);
  const [showServicePartnerDropdowns, setShowServicePartnerDropdowns] =
    useState(false);
  const [showCosellingPartnerDropdowns, setShowCosellingPartnerDropdowns] =
    useState(false);
  const [showStatesDropdown, setStatesDropdown] = useState(false);
  const getGrecaptchaToken = useGrecaptcha();

  useEffect(() => {
    const selectedCountry = watch("Country");
    if (selectedCountry && selectedCountry.includes("US")) {
      setStatesDropdown(true);
    } else {
      setStatesDropdown(false);
    }
  }, [showStatesDropdown, watch("Country")]);

  // Set up a watch that will control if the Plans Dropdown exists based on help options
  useEffect(() => {
    const selectedPartnershipType = watch("imt_Partner_Partnership_Type__c");
    const resetServicePartners = () => {
      setShowServicePartnerDropdowns(false);
      setValue("imt_Partner_Number_Of_Clients__c", null);
      setValue("imt_Partner_Integromat_Email__c", null);
      setValue("imt_Partner_Company_Bio__c", null);
      setValue("LOGO_png__c", null);
      setValue("imt_Partner_Other_Apps_Partnership__c", null);
      setValue("Type_of_Customer__c", null);
      setValue("imt_Partner_Affiliate_Link__c", null);
      setValue("imt_Partner_Main_Services__c", null);
    };
    const resetCosellingPartners = () => {
      setShowCosellingPartnerDropdowns(false);
      setValue("imt_Partner_Resell_Network_Exists__c", null);
      setValue("imt_Partner_Automation_Resold__c", null);
      setValue("imt_Partner_Company_Bio__c", null);
      setValue("LOGO_png__c", null);
      setValue("imt_Partner_Number_Of_Clients__c", null);
      setValue("imt_Partner_Integromat_Email__c", null);
      setValue("imt_Partner_Company_Bio__c", null);
      setValue("imt_Partner_Other_Apps_Partnership__c", null);
      setValue("Type_of_Customer__c", null);
      setValue("imt_Partner_Affiliate_Link__c", null);
      setValue("imt_Partner_Main_Services__c", null);
    };
    if (selectedPartnershipType) {
      if (
        selectedPartnershipType.includes("Agency Partner") ||
        selectedPartnershipType.includes("Strategic Partner") ||
        selectedPartnershipType.includes("Co-selling Partners")
      ) {
        setShowServicePartnerDropdowns(true);
      } else {
        resetServicePartners();
      }

      if (selectedPartnershipType.includes("Co-selling Partners")) {
        setShowCosellingPartnerDropdowns(true);
      } else {
        resetCosellingPartners();
      }
    } else {
      resetServicePartners();
      resetCosellingPartners();
    }
  }, [watch("imt_Partner_Partnership_Type__c")]);

  // Submit handler for the form
  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      const gRecaptcha = await getGrecaptchaToken();
      await fetch(submitWebHook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          gRecaptcha,
        }),
      });
      setShowModal(true);
      reset();
    } catch (err) {
      alert(err);
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
        <form name="becomePartnerForm" onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.row}>
            <Input
              name="FirstName"
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
              name="LastName"
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
              name="Title"
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
              name="Email"
              type="email"
              label="Work email"
              placeholder="Your work email"
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
              name="Phone"
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
              name="Company"
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
              name="Website"
              type="url"
              label="Website"
              placeholder="Your website"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please enter a valid url",
              }}
            />
            <DropdownSearch
              name="Country"
              label="Country"
              control={control}
              setValue={setValue}
              optionsArray={countries}
              placeholder="Please select"
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
          </div>
          <div className={styles.row}>
            <Input
              name="City"
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
            {showStatesDropdown ? (
              <DropdownSearch
                name="State"
                label="US state"
                control={control}
                setValue={setValue}
                optionsArray={states}
                placeholder="Please select"
                errors={errors}
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
              name="PostalCode"
              type="text"
              label="Postal code"
              placeholder="Your postal code"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please select a postal code",
              }}
            />
            <Input
              name="Street"
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
            <Dropdown
              name="Industry"
              label="Industry / Sector"
              control={control}
              setValue={setValue}
              optionsArray={industries}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Dropdown
              name="numberOfEmployees__c"
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
          </div>
          <div className={styles.row}>
            <Dropdown
              name="imt_Partner_Last_Year_Revenue_USD__c"
              label="Estimated revenue from your last year in USD?"
              control={control}
              setValue={setValue}
              optionsArray={["0-100k", "100k-500k", "500k-5M", "5M+"]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Dropdown
              name="imt_Partner_Years_Of_Establishment__c"
              label="How long has the company been established?"
              control={control}
              setValue={setValue}
              optionsArray={[
                "Less than 1 year",
                "1-3 years",
                "3-10 years",
                "More than 10 years",
              ]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
              validations={{
                required: false,
              }}
            />
          </div>
          <div className={styles.row}>
            <Dropdown
              name="imt_Partner_Partnership_Type__c"
              label="Partnership type"
              control={control}
              setValue={setValue}
              optionsArray={[
                "Agency Partners",
                "Co-selling Partners",
                "Technology Partners",
                "Academic Alliance",
                "Strategic Partners",
              ]}
              errors={errors}
              errorMessage="Please select an option"
              labelClassName={styles.dropdownLabel}
              containerClassName={styles.dropdownContainer}
            />
            <Dropdown
              name="Languages_Operated_in__c"
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
          {showServicePartnerDropdowns ? (
            <>
              <div className={styles.row}>
                <Input
                  name="imt_Partner_Affiliate_Link__c"
                  type="url"
                  label="If you have an affilitate link, please provide it here"
                  placeholder="Your affiliate link"
                  register={register}
                  errors={errors}
                  trigger={trigger}
                />
                <Dropdown
                  name="imt_Partner_Main_Services__c"
                  label="What are the main services of your company?"
                  control={control}
                  setValue={setValue}
                  optionsArray={[
                    "Consulting",
                    "Training",
                    "Basic workflow automation",
                    "Enterprise automation",
                    "Migration from Integromat to Make",
                    "Migration from third party to Make",
                    "Other",
                  ]}
                  errors={errors}
                  errorMessage="Please select an option"
                  labelClassName={styles.dropdownLabel}
                  containerClassName={styles.dropdownContainer}
                  multiselect
                />
              </div>
              <div className={styles.row}>
                <Dropdown
                  name="imt_Partner_Number_Of_Clients__c"
                  label="How many customers do you have?"
                  control={control}
                  setValue={setValue}
                  optionsArray={[
                    "1-15",
                    "16-50",
                    "51-100",
                    "101-200",
                    "200 above",
                  ]}
                  errors={errors}
                  // errorMessage="Please select an option"
                  labelClassName={styles.dropdownLabel}
                  containerClassName={styles.dropdownContainer}
                />
                <Input
                  name="imt_Partner_Integromat_Email__c"
                  type="email"
                  label="Your main Make account email"
                  placeholder="Your main Make account email"
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  validations={{
                    required: "Please enter a valid email address",
                  }}
                />
              </div>
              <div className={styles.row}>
                <TextArea
                  name="imt_Partner_Company_Bio__c"
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
                <Input
                  name="LOGO_png__c"
                  type="url"
                  label="Company logo"
                  placeholder="Company logo url"
                  register={register}
                  errors={errors}
                  trigger={trigger}
                  validations={{
                    required: "Please enter a valid url",
                  }}
                />
              </div>
              <div className={styles.row}>
                <Dropdown
                  name="imt_Partner_Other_Apps_Partnership__c"
                  label="What other app and services you are partnering with?"
                  control={control}
                  setValue={setValue}
                  optionsArray={[
                    "None",
                    "Activecampaign",
                    "Airtable",
                    "Android",
                    "Asana",
                    "Atlassian Umbrella",
                    "Bubble",
                    "Buffer",
                    "Calendly",
                    "Clickup",
                    "Datastore",
                    "Discord",
                    "Docusign",
                    "Dropbox",
                    "Email",
                    "Facebook",
                    "Freshdesk",
                    "Google",
                    "Http",
                    "Hubspotcrm",
                    "Instagram",
                    "Ios",
                    "Jira",
                    "Jotform",
                    "Json",
                    "Linkedin",
                    "Mailchimp",
                    "Mailerlite",
                    "Meta / Facebook",
                    "Microsoft",
                    "Monday",
                    "Mysql",
                    "Notion",
                    "Onedrive",
                    "Pipedrive",
                    "Quickbooks",
                    "Salesforce",
                    "Sendgrid",
                    "Sendinblue",
                    "Shopify",
                    "Slack",
                    "Stripe",
                    "Telegram",
                    "Todoist",
                    "Trello",
                    "Twilio",
                    "Twitter",
                    "Typeform",
                    "Webflow",
                    "Webhook",
                    "Woocommerce",
                    "Wordpress",
                    "Xero",
                    "Zendesk",
                    "Zohocrm",
                  ]}
                  errors={errors}
                  errorMessage="Please select an option"
                  labelClassName={styles.dropdownLabel}
                  containerClassName={styles.dropdownContainer}
                  multiselect
                />
                <Dropdown
                  name="Type_of_Customer__c"
                  label="What's your customer type?"
                  control={control}
                  setValue={setValue}
                  optionsArray={["SMB", "Enterprise", "OEM"]}
                  errors={errors}
                  errorMessage="Please select an option"
                  labelClassName={styles.dropdownLabel}
                  containerClassName={styles.dropdownContainer}
                  multiselect
                />
              </div>
            </>
          ) : null}
          {showCosellingPartnerDropdowns ? (
            <>
              <div className={styles.row}>
                <Dropdown
                  name="imt_Partner_Resell_Network_Exists__c"
                  label="Do you have a sales team?"
                  control={control}
                  setValue={setValue}
                  optionsArray={["Yes", "No"]}
                  errors={errors}
                  errorMessage="Please select an option"
                  labelClassName={styles.dropdownLabel}
                  containerClassName={styles.dropdownContainer}
                  // multiselect
                />
                <Dropdown
                  name="imt_Partner_Automation_Resold__c"
                  label="What are the other platforms do you resell?"
                  control={control}
                  setValue={setValue}
                  optionsArray={[
                    "None",
                    "Actiondesk",
                    "Airtable",
                    "Asana",
                    "Atlassian Umbrella",
                    "Automate.io",
                    "Boomi",
                    "Hubspotcrm",
                    "Informatica",
                    "Integrately",
                    "Jitterbit",
                    "Mailchimp",
                    "Mailerlite",
                    "Monday",
                    "Mulesoft",
                    "Pipedrive",
                    "Salesforce",
                    "Snaplogic",
                    "Tray.io",
                    "Workato",
                    "Zapier",
                    "Zohocrm",
                  ]}
                  errors={errors}
                  errorMessage="Please select an option"
                  labelClassName={styles.dropdownLabel}
                  containerClassName={styles.dropdownContainer}
                  multiselect
                />
              </div>
            </>
          ) : null}
          <div className={styles.row}>
            <Input
              name="notes__c"
              type="Text"
              label="Why do you want to become a partner?"
              placeholder="Why do you want to become a partner?"
              register={register}
              errors={errors}
              trigger={trigger}
              validations={{
                required: "Please provide an answer",
              }}
            />
            <Dropdown
              name="imt_Partner_Source__c"
              label="How did you learn about the Make partner program?"
              control={control}
              setValue={setValue}
              optionsArray={[
                "Make website",
                "LinkedIn",
                "Webinars held by Make partners ",
                "My own research",
                "Other",
              ]}
              errors={errors}
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
