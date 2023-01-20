import { Link } from "@components/common";
import { PageImage } from "@components/page";
import _ from "lodash";
import cn from "classnames";
import moment from "moment-timezone";
import PlayVideo from "@icons/PlayVideo";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styles from "./FeaturedBlog.module.scss";

const propTypes = {
  blogIndexData: PropTypes.shape({
    featuredTitle: PropTypes.string.isRequired,
    featuredLinkText: PropTypes.string.isRequired,
    featuredLink: PropTypes.object,
  }).isRequired,
  featuredBlog: PropTypes.shape({
    date: PropTypes.string.isRequired,
    image: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
  featuredLink: PropTypes.object,
  useCase: PropTypes.bool,
  webinar: PropTypes.bool,
};

// Featured Blog for the blog index page
const FeaturedBlog = ({ featuredBlog, blogIndexData, useCase, webinar }) => {
  const featuredImage = _.get(featuredBlog, "image");
  const formattedDate = moment(new Date(_.get(featuredBlog, "date")))
    .tz(moment.tz.guess())
    .format("MMMM Do, YYYY, h:mm a z");
  return (
    <div className={cn("container", styles.featuredBlogContainer)}>
      <div
        className={cn(
          styles.featuredImage,
          !featuredImage ? styles.placeholderImage : ""
        )}
      >
        <div className={styles.imageContainer}>
          {featuredImage ? (
            <PageImage image={featuredImage} width={768} />
          ) : (
            <PlayVideo />
          )}
        </div>
      </div>
      <div className={styles.featuredBlogData}>
        {webinar && featuredBlog.upcoming ? (
          <p className={styles.featuredDate}>{formattedDate}</p>
        ) : (
          <p className={styles.featuredTitle}>{blogIndexData.featuredTitle}</p>
        )}
        <h1 className={cn("h2", styles.featuredBlogTitle)}>
          {webinar
            ? featuredBlog.name
            : featuredBlog.title || featuredBlog.description}
        </h1>
        <ReactMarkdown className={cn(styles.featuredBlogDescription)}>
          {featuredBlog.description}
        </ReactMarkdown>
        <Link
          className="bold"
          link={
            (webinar && {
              name: featuredBlog.upcoming
                ? blogIndexData.featuredLink.name
                : "Watch now →",
              slug: `/webinars/${blogIndexData.featuredWebinar.slug}`,
            }) ||
            (useCase && {
              name: blogIndexData.featuredLinkText,
              slug: `/use-cases/${featuredBlog.slug}`,
            }) ||
            (blogIndexData.featuredLink && blogIndexData.featuredLink) || {
              name: blogIndexData.featuredLinkText,
              slug: `/blog/${featuredBlog.slug}`,
            }
          }
        />
      </div>
    </div>
  );
};

FeaturedBlog.propTypes = propTypes;

export default FeaturedBlog;
