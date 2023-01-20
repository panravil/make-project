import { useState } from "react";
import styles from "./BlogFooter.module.scss";
import cn from "classnames";
import { useForm } from "react-hook-form";
import { Input, Modal } from "@components/common";
import { PageSectionWrapper } from "@components/page";
import PropTypes from "prop-types";

const propTypes = {
  thanksForSubscribingText: PropTypes.string.isRequired,
  blogFooterData: PropTypes.shape({
    blogFooterDescription: PropTypes.string.isRequired,
    blogFooterTitle: PropTypes.string.isRequired,
    placeholderText: PropTypes.string.isRequired,
    subscribeButtonText: PropTypes.string.isRequired,
  }).isRequired,
  fields: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  section: PropTypes.array,
};

// Blog Footer for the blog index page
const BlogFooter = ({
  blogFooterData,
  thanksForSubscribingText,
  fields,
  index,
  sections,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showModal, setShowModal] = useState(false);

  const onSubmit = (data, event) => {
    event.preventDefault();
    // onSubmit, Send user data to companies email subscription list
    fetch(process.env.NEXT_PUBLIC_SUBSCRIBE_HOOK, {
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
    <>
      <PageSectionWrapper fields={fields} sections={sections} index={index}>
        <div className={cn("container", styles.blogFooterContainer)}>
          {/* when the user subscribes, open popup to say thanks */}
          <div className={styles.blogFooter}>
            <h2 className={styles.blogFooterTitle}>
              {blogFooterData.blogFooterTitle}
            </h2>
            <div className={cn("body-large", styles.blogFooterDescription)}>
              {blogFooterData.blogFooterDescription}
            </div>
            <form
              name="subscribe"
              className={styles.subscribeForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                className={styles.subscribeInput}
                name="email"
                type="email"
                placeholder={blogFooterData.placeholderText}
                register={register}
                errors={errors}
                validations={{
                  required: "Please submit a valid email",
                }}
              />
              <button
                className={cn("gradient full-width", styles.submitButton)}
                type="submit"
              >
                {blogFooterData.subscribeButtonText}
              </button>
            </form>
          </div>
        </div>
      </PageSectionWrapper>
      {showModal ? (
        <Modal setShowModal={setShowModal}>{thanksForSubscribingText}</Modal>
      ) : null}
    </>
  );
};

BlogFooter.propTypes = propTypes;

export default BlogFooter;
