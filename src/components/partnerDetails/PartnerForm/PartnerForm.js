import styles from "./PartnerForm.module.scss";
import { useState } from "react";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";

import { Input, Rating, TextArea, Modal } from "@components/common";

const propTypes = {
  fields: PropTypes.shape({
    formTitle: PropTypes.string.isRequired,
    formDescription: PropTypes.string.isRequired,
    formWebHook: PropTypes.string.isRequired,
    formSubmitButtonText: PropTypes.string.isRequired,
    formSubmitSuccessText: PropTypes.string.isRequired,
  }).isRequired,
};

// Component that renders the Request Demo form and handles submitting data
const PartnerForm = ({ fields }) => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useFormContext();
  const {
    formTitle,
    formDescription,
    formWebHook,
    formSubmitButtonText,
    formSubmitSuccessText,
  } = fields;

  const [showModal, setShowModal] = useState(false);

  // Submit handler for the form
  const onSubmit = (data, event) => {
    event.preventDefault();
    const processedData = data;
    // Function to encode data to send through fetch
    fetch(formWebHook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processedData),
    })
      .then(() => {
        setShowModal(true);
        reset();
      })
      .catch((err) => alert(err));
  };

  return (
    <div className={cn(styles.requestFormContainer)}>
      {showModal ? (
        <Modal setShowModal={setShowModal}>{formSubmitSuccessText}</Modal>
      ) : null}
      <div className={cn("h4", styles.formTitle)}>{formTitle}</div>
      <ReactMarkdown className={cn("body-large", styles.formDescription)}>
        {formDescription}
      </ReactMarkdown>
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
          label="Email*"
          placeholder="Your Email"
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
        <TextArea
          name="review"
          type="text"
          label="Write a Review*"
          placeholder="Write a review..."
          register={register}
          errors={errors}
          trigger={trigger}
          validations={{
            required: "Please write a review.",
          }}
        />
        <Rating
          name="rating"
          control={control}
          className={styles.ratingInput}
          label="Rating*"
          setValue={setValue}
          validations={{
            required: "Please leave a rating",
          }}
          errors={errors}
        />
        <button
          className={cn("gradient full-width", styles.formButton)}
          type="submit"
        >
          {formSubmitButtonText}
        </button>
      </form>
    </div>
  );
};

PartnerForm.propTypes = propTypes;

export default PartnerForm;
