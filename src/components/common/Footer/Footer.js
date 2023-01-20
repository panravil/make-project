import { useState } from "react";
import styles from "./Footer.module.scss";
import { useForm } from "react-hook-form";
import { Input } from "..";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoLogoYoutube,
} from "react-icons/io5";

import { Link, Modal, BasicLink } from "@components/common";

const propTypes = {
  footerData: PropTypes.shape({
    ctaTitle: PropTypes.string.isRequired,
    ctaDescription: PropTypes.string.isRequired,
    ctaLink: PropTypes.object.isRequired,
    subscribeTitle: PropTypes.string.isRequired,
    subscribeDescription: PropTypes.string.isRequired,
    subscribeSubmitText: PropTypes.string.isRequired,
    subscribeModalText: PropTypes.string.isRequired,
    footerLinkColumnCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          columnTitle: PropTypes.string.isRequired,
          columnLinkCollection: PropTypes.shape({
            items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
    copyrightText: PropTypes.string.isRequired,
    socialLinksCollection: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    }).isRequired,
  }),
  footerRef: PropTypes.object.isRequired,
};

// Footer Component that switches between rows and columns when sizing up
const Footer = ({ footerData, footerRef }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showModal, setShowModal] = useState(false);
  const ctaLink =
    _.get(footerData, "ctaLink.fields") || _.get(footerData, "ctaLink");
  const linkColumnsArray =
    _.get(footerData, "footerLinkColumnCollection.items") || [];
  const socialLinksArray =
    _.get(footerData, "socialLinksCollection.items") || [];

  // Map function that renders and styles the individual links in the footer
  const renderLinksMap = (link, index) => {
    return (
      <Link
        key={index}
        link={link}
        className={cn("caption", styles.columnLink)}
        prefetch={false}
      />
    );
  };

  // Map function that renders and styles the columns of links in the footer
  const renderColumnMap = (column, index) => {
    const links = _.get(column, "columnLinkCollection.items");
    // setting styled links to a variable to use in the columns
    const renderLinks = links.map(renderLinksMap);

    return (
      <div key={index} className={styles.linkColumn}>
        <div className={cn("small", styles.columnHeader)}>
          {column.columnTitle}
        </div>
        {renderLinks}
      </div>
    );
  };

  // setting the columns to a variable to display on the page
  const renderLinkColumn = linkColumnsArray.map(renderColumnMap);

  // Map to render the social Links and give them the correct icons for
  // each social media
  const renderSocialLinks = socialLinksArray.map((socialLink, index) => {
    let socialLogo;
    let linkName;
    switch (socialLink.name) {
      case "Facebook":
        socialLogo = <IoLogoFacebook />;
        linkName = "Facebook";
        break;
      case "LinkedIn":
        socialLogo = <IoLogoLinkedin />;
        linkName = "LinkedIn";
        break;
      case "Instagram":
        socialLogo = <IoLogoInstagram />;
        linkName = "Instagram";
        break;
      case "Youtube":
        socialLogo = <IoLogoYoutube />;
        linkName = "Youtube";
        break;
      case "Twitter":
        socialLogo = <IoLogoTwitter />;
        linkName = "Twitter";
        break;
    }
    return (
      <Link
        key={index}
        link={socialLink}
        className="secondary"
        ariaLabel={linkName}
      >
        {socialLogo}
      </Link>
    );
  });

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
    <footer className={styles.footer}>
      {/* when the user subscribes, open popup to say thanks */}
      {showModal ? (
        <Modal setShowModal={setShowModal}>
          {footerData.subscribeModalText}
        </Modal>
      ) : null}
      <section className="dark-background">
        <div className={cn("container", styles.trialContainer)}>
          <h2>{footerData?.ctaTitle}</h2>
          {_.get(footerData, "ctaDescription") ? (
            <ReactMarkdown className={cn("body-large", styles.ctaDescription)}>
              {footerData?.ctaDescription}
            </ReactMarkdown>
          ) : null}
          {_.get(ctaLink, "slug") ? (
            <Link
              link={ctaLink}
              className={cn("button gradient", styles.button)}
            />
          ) : null}
        </div>
        <div className={cn("container", styles.footerContainer)}>
          <div className={styles.footerBody}>
            <form
              name="subscribe"
              className={styles.subscribeForm}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                className={styles.subscribeInput}
                name="email"
                type="email"
                label={footerData?.subscribeTitle}
                placeholder="Your email address"
                register={register}
                errors={errors}
                validations={{
                  required: "Please submit a valid email",
                }}
              />
              {_.get(footerData, "subscribeDescription") ? (
                <ReactMarkdown
                  className={cn("small", styles.subscribeDescription)}
                >
                  {footerData?.subscribeDescription}
                </ReactMarkdown>
              ) : null}
              <button
                className={cn("text-button link bold", styles.submitButton)}
                type="submit"
              >
                {footerData?.subscribeSubmitText}
              </button>
            </form>
            <div className={styles.linkColumnContainer}>{renderLinkColumn}</div>
          </div>
          <div className={styles.copyrightRow} ref={footerRef}>
            <div className={"heading"}>
              © {new Date().getFullYear()} {_.get(footerData, "copyrightText")}
            </div>
            <div className={styles.socialLinksRow}>{renderSocialLinks}</div>
          </div>
        </div>
      </section>
    </footer>
  );
};

Footer.propTypes = propTypes;

export default Footer;
