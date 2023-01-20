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
    bottomLinksCollection: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object.isRequired),
    }),
    socialLinksCollection: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    }).isRequired,
  }),
  footerRef: PropTypes.object.isRequired,
};

// Footer Component that switches between rows and columns when sizing up
const SimpleFooter = ({ footerData, footerRef }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showModal, setShowModal] = useState(false);
  const ctaLink =
    _.get(footerData, "ctaLink.fields") || _.get(footerData, "ctaLink");
  const linkColumnsArray = _.get(
    footerData,
    "footerLinkColumnCollection.items"
  );
  const socialLinksArray = _.get(footerData, "socialLinksCollection.items");

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

  const renderSimpleLinks = function (items) {
    return items.map((link, index) => {
      return (
        <>
          <span className={styles.bottomLinksSeparator}> | </span>
          <Link
            key={index}
            link={link}
            /*className={cn("caption", styles.columnLink)}*/
            prefetch={false}
          />
        </>
      );
    });
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
        {footerData?.ctaTitle ||
        _.get(footerData, "ctaDescription") ||
        _.get(ctaLink, "slug") ? (
          <div className={cn("container", styles.trialContainer)}>
            {footerData?.ctaTitle ? <h2>{footerData?.ctaTitle}</h2> : null}
            {_.get(footerData, "ctaDescription") ? (
              <ReactMarkdown
                className={cn("body-large", styles.ctaDescription)}
              >
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
        ) : null}
        <div className={cn("container", styles.footerContainer)}>
          <div className={styles.copyrightRow} ref={footerRef}>
            <div className={"heading"}>
              © {new Date().getFullYear()} {_.get(footerData, "copyrightText")}
              {footerData?.bottomLinksCollection?.items?.length ? (
                <span className={styles.bottomLinksContainer}>
                  {renderSimpleLinks(footerData.bottomLinksCollection.items)}
                </span>
              ) : null}
            </div>
            <div className={styles.socialLinksRow}>{renderSocialLinks}</div>
          </div>
        </div>
      </section>
    </footer>
  );
};

SimpleFooter.propTypes = propTypes;

export default SimpleFooter;
