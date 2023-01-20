import styles from "./HowItWorks.module.scss";
import { useState } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import cn from "classnames";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { Modal } from "@components/common";
import { PageSectionWrapper } from "@components/page";
import PlayVideo from "@icons/PlayVideo";
import replaceDetailsWildCard from "@utils/replaceDetailsWildCard";
import replaceRangeWildCard from "@utils/replaceRangeWildCard";

const propTypes = {
  name: PropTypes.string.isRequired,
  name2: PropTypes.string,
  name3: PropTypes.string,
  appDetails: PropTypes.shape({
    videoTitle: PropTypes.string,
    videoDescription: PropTypes.string,
    videoPlaceholderImage: PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    videosCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          time: PropTypes.number.isRequired,
          description: PropTypes.string.isRequired,
          videoUrl: PropTypes.string,
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,
  total: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  sections: PropTypes.array.isRequired,
};

// How it works component for both the Template and Apps page
const HowItWorks = ({
  name,
  name2,
  name3,
  appDetails,
  total,
  fields,
  index,
  sections,
}) => {
  const videos = _.get(appDetails, "videosCollection.items");
  const videoImage = _.get(appDetails, "videoPlaceholderImage");
  const nameArray = [name, name2, name3];
  const [video, setVideo] = useState(null);

  // If there is a video image, render the image as a clickable link, if there's not, render the missing placeholder image
  const renderVideoPlaceholder = videoImage ? (
    <div data-cy="HowItWorks" className={styles.videoPlaceholderContainer}>
      <Image
        src={videoImage.url}
        alt={videoImage.title}
        layout="responsive"
        sizes={"76.8rem"}
        height={(videoImage.height * 768) / videoImage.width}
        width={768}
        quality={90}
      />
      <div className={styles.textOverlay}>
        <div className={styles.iconWrapper}>
          <PlayVideo />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.missingPlaceholderImage}>
      <div className={styles.iconWrapper}>
        <PlayVideo />
      </div>
    </div>
  );

  // .map returning a list of steps styled using the Step card component
  const renderStepCards =
    videos?.length > 0 ? (
      videos.map((video, index) => {
        return (
          <div
            key={index}
            className={cn(
              styles.stepCard,
              videos.length === 1 ? styles.oneVideo : ""
            )}
          >
            <div className={styles.header}>
              <span className={cn("h4", styles.title)}>{video?.title}</span>
            </div>
            <div className={cn("small", styles.useDescription)}>
              {video?.description}
            </div>
            <div className={styles.videoImageContainer}>
              <div
                onClick={() => setVideo(video?.videoUrl)}
                onKeyPress={() => setVideo(video?.videoUrl)}
                aria-label="Video Placeholder Image"
                role="button"
                tabIndex={0}
                className={styles.videoImage}
              >
                {renderVideoPlaceholder}
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div>No Steps Available</div>
    );

  if (videos?.length > 0) {
    return (
      <>
        <PageSectionWrapper fields={fields} index={index} sections={sections}>
          <div className={cn("container", styles.howItWorks)}>
            <h2 className={styles.header}>
              {replaceRangeWildCard(
                replaceDetailsWildCard(appDetails?.videoTitle, nameArray),
                total
              )}
            </h2>
            <div className={cn("body-large", styles.paragraph)}>
              <ReactMarkdown>
                {replaceRangeWildCard(
                  replaceDetailsWildCard(
                    appDetails?.videoDescription,
                    nameArray
                  ),
                  total
                )}
              </ReactMarkdown>
            </div>
            <div
              className={cn(
                styles.stepCardsContainer,
                videos.length === 1 ? styles.oneCard : ""
              )}
            >
              {renderStepCards}
            </div>
          </div>
        </PageSectionWrapper>
        {video ? (
          <Modal setShowModal={setVideo} videoPlayer>
            <iframe
              width="100%"
              height="100%"
              src={video}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Modal>
        ) : null}
      </>
    );
  } else {
    return <></>;
  }
};

HowItWorks.propTypes = propTypes;

export default HowItWorks;
