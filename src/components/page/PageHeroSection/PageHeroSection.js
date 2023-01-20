// import { useState, useEffect, useRef } from "react";
import { useState, useEffect } from "react";
import styles from "./PageHeroSection.module.scss";
import cn from "classnames";
// import { throttle } from "lodash";
import _ from "lodash";
import { browserName } from "react-device-detect";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import CheckMark from "@icons/CheckMark";
import { Link } from "@components/common";
import { PageSectionWrapper } from "@components/page";
import Typed from "react-typed";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    captions: PropTypes.arrayOf(PropTypes.string),
    cyclingText: PropTypes.arrayOf(PropTypes.string),
    videoChrome: PropTypes.object,
    videoSafari: PropTypes.object,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
};

// Home Page Header Component
const PageHeroSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const captions = _.get(fields, "captions") || [];
  const cyclingText = _.get(fields, "cyclingText") || [];
  const videoSafari = _.get(fields, "videoSafari.fields");
  const videoChrome = _.get(fields, "videoChrome.fields");
  const [isSafari, setIsSafari] = useState(null);

  useEffect(() => {
    setIsSafari(browserName === "Safari");
  }, [browserName]);

  // TODO: SITE INTERACT FOR VIDEO ?
  // // siteInteract is a useful piece of state (TODO: split out into context)
  // // that waits for either a click or a scroll of the website before rendering
  // // whatever unoptimized images or scripts is associated with it.
  // // for now this is a quick solution for handling the very unoptimized product hunt.
  // const [siteInteract, setSiteInteract] = useState(false);
  // const siteInteractRef = useRef();
  // useEffect(() => {
  //   siteInteractRef.current = siteInteract;
  // }, [siteInteract]);
  //
  // // useEffect that controlls the scroll listener for the product hunt move
  // useEffect(() => {
  //   window.addEventListener("scroll", interactOnScroll);
  //   return () => {
  //     window.removeEventListener("scroll", interactOnScroll);
  //   };
  // }, []);
  //
  // // stops certain scripts from running until a user interacts with something on the site
  // // having the scripts load immediately was causing delays
  // const interactOnScroll = throttle(() => {
  //   if (!siteInteractRef.current) {
  //     setSiteInteract(true);
  //   }
  // }, 200);

  // Function to render the title of the section
  const renderTitle = () => {
    return (
      <span className={styles.animateText}>
        {cyclingText?.length > 0 && (
          <Typed
            strings={cyclingText}
            typeSpeed={50}
            showCursor={false}
            loop={true}
            fadeOut={true}
          />
        )}
      </span>
    );
  };

  // Renders the list of captions that shows up below the get started button
  const renderCaptionsList = captions.map((perk, index) => {
    return (
      <div key={index} className={cn(styles.perk, "heading")}>
        <div className={styles.iconWrapper}>
          <CheckMark />
        </div>
        {perk}
      </div>
    );
  });

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div className={cn("container", styles.homePageHeader)}>
        {index === 0 ? (
          <h1 className="primary">
            {renderTitle()}
            <br />
            {title}
          </h1>
        ) : (
          <h2 className="primary">
            {renderTitle()}
            <br />
            {title}
          </h2>
        )}
        {description ? (
          <div className={cn("body-large", styles.description)}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ) : null}

        {_.get(link, "slug") && (
          <Link link={link} className="button gradient large" />
        )}
        {captions?.length > 0 && (
          <div className={styles.captionsList}>{renderCaptionsList}</div>
        )}
        {!_.isNull(isSafari) && isSafari ? (
          <video
            className={styles.video}
            width={"100%"}
            height={"100%"}
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src={_.get(videoSafari, "file.url")}
              type={
                _.get(videoSafari, "file.contentType") === "video/mp4"
                  ? `video/mp4; codecs="hvc1"`
                  : _.get(videoSafari, "file.contentType")
              }
            />
          </video>
        ) : null}
        {!_.isNull(isSafari) && !isSafari ? (
          <video
            className={styles.video}
            width={"100%"}
            height={"100%"}
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src={_.get(videoChrome, "file.url")}
              type={_.get(videoChrome, "file.contentType")}
            />
          </video>
        ) : null}
      </div>
    </PageSectionWrapper>
  );
};

PageHeroSection.propTypes = propTypes;

export default PageHeroSection;
