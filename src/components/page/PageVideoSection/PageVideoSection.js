import React, { useState, useEffect } from "react";
import styles from "./PageVideoSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { browserName } from "react-device-detect";

import { Link, Modal } from "@components/common";
import { PageSectionWrapper, PageImage } from "@components/page";
import PlayVideo from "@icons/PlayVideo";
import CheckMark from "@icons/CheckMark";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.object,
    captions: PropTypes.arrayOf(PropTypes.string),
    placeholderImage: PropTypes.object,
    placeholderText: PropTypes.string,
    videoUrl: PropTypes.string.isRequired,
    captionList: PropTypes.arrayOf(PropTypes.string.isRequired),
    captionTitle: PropTypes.string,
    videoChrome: PropTypes.object,
    videoSafari: PropTypes.object,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
  pageData: PropTypes.object,
};

// Component for the Simplify Work section
const PageVideoSection = ({ fields, sections, index, pageData }) => {
  const [showModal, setShowModal] = useState(false);
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const placeholderText = _.get(fields, "placeholderText");
  const videoUrl = _.get(fields, "videoUrl");
  const captionTitle = _.get(fields, "captionTitle");
  const captionList = _.get(fields, "captionList");
  const pageSlug = pageData?.fields?.slug;
  const videoSafari = _.get(fields, "videoSafari.fields");
  const videoChrome = _.get(fields, "videoChrome.fields");
  const [isSafari, setIsSafari] = useState(null);

  useEffect(() => {
    setIsSafari(browserName === "Safari");
  }, [browserName]);

  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const captions = _.get(fields, "captions") || [];

  // Function to render the list of captions
  const renderCaptionList = (captionList || []).map((caption, index) => {
    return (
      <div key={index} className={cn(styles.company, "card-background")}>
        {caption}
      </div>
    );
  });

  // Renders the list of captions that shows up below the get started button
  const renderCaptions = captions.map((perk, index) => {
    return (
      <div key={index} className={cn(styles.perk, "heading")}>
        <div className={styles.iconWrapper}>
          <CheckMark />
        </div>
        {perk}
      </div>
    );
  });

  const hasInlineVideo = videoSafari || videoChrome;

  // Function to render the placeholder video image if there is one supplied or a default if not
  const renderVideoPlaceholder = () => {
    const placeholderImage =
      _.get(fields, "placeholderImage.fields") ||
      _.get(fields, "placeholderImage");
    if (placeholderImage) {
      return (
        <div className={styles.videoPlaceholderContainer}>
          <PageImage image={placeholderImage} width={768} />
          <div className={styles.textOverlay}>
            <div
              className={
                pageSlug === "product" || pageSlug === undefined
                  ? styles.noIconWrapper
                  : styles.iconWrapper
              }
            >
              <PlayVideo />
            </div>
            {placeholderText}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.missingPlaceholderImage}>
          <div className={styles.iconWrapper}>
            <PlayVideo />
          </div>
          {placeholderText}
        </div>
      );
    }
  };

  return (
    <>
      <PageSectionWrapper fields={fields} sections={sections} index={index}>
        <div className={cn("container", styles.videoSection)}>
          <div className={styles.videoSectionHeader}>
            {subtitle ? <p>{subtitle}</p> : null}
            {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
            {description ? (
              <div className={cn("body-large", styles.description)}>
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            ) : null}
            {_.get(link, "slug") && (
              <Link link={link} className="button gradient" />
            )}
            {captions?.length > 0 && (
              <div className={styles.captionsList}>{renderCaptions}</div>
            )}
          </div>
          {hasInlineVideo ? (
            <>
              <video
                className={cn(
                  styles.video,
                  fields.videoPosition
                    ? styles[`align-${fields.videoPosition}`]
                    : null
                )}
                width={"100%"}
                height={"100%"}
                autoPlay
                loop
                muted
                playsInline
              >
                {videoSafari ? (
                  <source
                    src={_.get(videoSafari, "file.url")}
                    type={
                      _.get(videoSafari, "file.contentType") === "video/mp4"
                        ? `video/mp4`
                        : _.get(videoSafari, "file.contentType")
                    }
                  />
                ) : null}
                {videoChrome ? (
                  <source
                    src={_.get(videoChrome, "file.url")}
                    type={_.get(videoChrome, "file.contentType")}
                  />
                ) : null}
              </video>
            </>
          ) : (
            <div
              className={cn(
                styles.videoImageContainer,
                fields.videoPosition
                  ? styles[`align-${fields.videoPosition}`]
                  : null
              )}
            >
              <div
                onClick={() => setShowModal(true)}
                onKeyPress={() => setShowModal(true)}
                role="button"
                tabIndex={0}
                className={styles.videoImage}
              >
                {renderVideoPlaceholder()}
              </div>
            </div>
          )}

          {captionTitle || captionList ? (
            <>
              <div className={styles.videoCaptionContainer}>
                <div className={styles.videoCaptionTitle}>{captionTitle}</div>
                {renderCaptionList}
              </div>
            </>
          ) : null}
        </div>
      </PageSectionWrapper>
      {showModal && videoUrl ? (
        <Modal setShowModal={setShowModal} videoPlayer>
          <iframe
            width="100%"
            height="100%"
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Modal>
      ) : null}
    </>
  );
};

PageVideoSection.propTypes = propTypes;

export default PageVideoSection;
