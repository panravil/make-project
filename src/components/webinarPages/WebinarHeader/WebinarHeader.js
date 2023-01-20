import _ from "lodash";
import { AuthorCard, ShareThisArticle } from "@components/blogPages";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { PageImage } from "@components/page";
import { WebinarForm } from "@components/forms";
import cn from "classnames";
import moment from "moment-timezone";
import momentBase from "moment/min/moment-with-locales";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import renderRichTextOptions from "@utils/renderRichTextOptions";
import styles from "./WebinarHeader.module.scss";

import Sticky from "react-stickynode";

const propTypes = {
  webinarData: PropTypes.shape({}),
};

// Blog Header for the blog index page
const BlogBody = ({ webinarData }) => {
  const name = webinarData.name;
  const video = webinarData.video;
  const embedVideo = webinarData.embedVideo;
  const image = webinarData.image;
  const content = _.get(webinarData, "content.json");
  const description = webinarData?.description;
  const upcoming = webinarData?.upcoming;
  const colsClass = upcoming ? "upcoming" : null;
  const lang = webinarData.language || "en";
  const timeZone = moment(webinarData.date)
    .tz(moment.tz.guess())
    .locale(lang)
    .format("z");
  const localDate = upcoming
    ? momentBase(webinarData.date)
        .locale(lang)
        .format(
          (lang === "en" && "MMMM Do, YYYY, h:mm a z") ||
            (lang === "cs" && "DD. MMMM YYYY, H:mm z") ||
            (lang === "fr" && "DD MMMM YYYY, H:mm z") ||
            "LLL"
        ) +
      " " +
      timeZone
    : momentBase(webinarData.date).locale(lang).fromNow();

  const webinarFooterData = {
    ...webinarData,
    shareTitle: "Share and invite your network!",
  };
  const fields = {
    agreementText:
      "By clicking „Register to webinar“, I agree that I have read and understand the [Privacy Policy](/en/privacy-notice).",
    consentText:
      "I would like to receive more infromation about Make and its services. I hereby consent to receive electronic messages and other communications from Make.",
    formTitle: "Save my spot",
    submissionModalText:
      "You’re all set! Watch your email for confirmation and details.",
    submitButtonText: "Register to webinar",
    submitWebHook: "https://hook.eu1.make.com/byr5v3jfsl3g1p4ltumkwq37g42ok043",
    webinarName: webinarData.name,
    webinarDate: moment(new Date(webinarData.date)).format(),
    webinarUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/en/webinars/${webinarData.slug}`,
    formSubmitted: moment().format(),
  };

  return (
    <>
      <div className={cn("container", styles[colsClass], styles.webinarHeader)}>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.date} title={webinarData.date}>
          {localDate}
        </p>
        <div className={cn(styles.detailsRow)}>
          <div className={cn(styles.colWrapper)}>
            <div className={styles.mediaWrapper}>
              {video ? (
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
                    src={_.get(video, "url")}
                    type={_.get(video, "contentType")}
                  />
                </video>
              ) : embedVideo ? (
                <div dangerouslySetInnerHTML={{ __html: embedVideo }} />
              ) : image ? (
                <PageImage
                  className={styles.image}
                  image={image}
                  width={1184}
                />
              ) : null}
            </div>

            <div className={styles.contentWrapper}>
              {content ? (
                documentToReactComponents(
                  content,
                  renderRichTextOptions(_.get(webinarData, "about.links"))
                )
              ) : (
                <ReactMarkdown className={cn(styles.description)}>
                  {description}
                </ReactMarkdown>
              )}
            </div>

            {webinarData.authorCollection.items.length > 0 && (
              <div className={styles.speakersWrapper}>
                <h2 className={cn("h3", styles.authorHeading)}>Speakers</h2>
                {webinarData.authorCollection.items.map((object) => (
                  <AuthorCard
                    author={{
                      ...object,
                      authorCardContainer: "webinars",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {upcoming ? (
            <div className={styles.formWrapper}>
              <Sticky enabled={true} top={100} bottomBoundary={2300}>
                <WebinarForm fields={fields} />
              </Sticky>
            </div>
          ) : null}
        </div>
      </div>
      <ShareThisArticle blogFooterData={webinarFooterData} />
    </>
  );
};

BlogBody.propTypes = propTypes;

export default BlogBody;
