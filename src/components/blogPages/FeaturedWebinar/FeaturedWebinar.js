import { Link } from "@components/common";
import { PageImage } from "@components/page";
import cn from "classnames";
import moment from "moment-timezone";
import momentBase from "moment/min/moment-with-locales";
import PlayVideo from "@icons/PlayVideo";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styles from "./FeaturedWebinar.module.scss";

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
const FeaturedWebinar = ({ featuredBlog, blogIndexData }) => {
  const filteredItems = featuredBlog.reduce((filtered, item) => {
    if (item?.featured) {
      filtered.push(item);
    }
    return filtered;
  }, []);

  return (
    <>
      {filteredItems.length > 0 &&
        filteredItems.map((item, index) => {
          const date = item.date;
          const description = item.description;
          const image = item.image;
          const lang = item.language || "en";
          const name = item.name;
          const slug = item.slug;
          const upcoming = item.upcoming;
          const timeZone = moment(date)
            .tz(moment.tz.guess())
            .locale(lang)
            .format("z");
          const localDate = upcoming
            ? momentBase(date)
                .locale(lang)
                .format(
                  (lang === "en" && "MMMM Do, YYYY, h:mm a z") ||
                    (lang === "cs" && "DD. MMMM YYYY, H:mm z") ||
                    (lang === "fr" && "DD MMMM YYYY, H:mm z") ||
                    "LLL"
                ) +
              " " +
              timeZone
            : momentBase(date).locale(lang).fromNow();
          return (
            <div
              className={cn("container", styles.featuredBlogContainer)}
              key={index}
            >
              <div
                className={cn(
                  styles.featuredImage,
                  !image ? styles.placeholderImage : ""
                )}
              >
                <div className={styles.imageContainer}>
                  {image ? (
                    <PageImage image={image} width={768} />
                  ) : (
                    <PlayVideo />
                  )}
                </div>
              </div>
              <div className={styles.featuredBlogData}>
                <p className={styles.featuredTitle}>
                  {blogIndexData.featuredTitle}
                </p>
                <h1 className={cn("h2", styles.featuredBlogTitle)}>{name}</h1>
                <ReactMarkdown className={cn(styles.featuredBlogDescription)}>
                  {description}
                </ReactMarkdown>
                <Link
                  className="bold"
                  link={{
                    name: upcoming ? "Learn more →" : "Watch now →",
                    slug: `/webinars/${slug}`,
                  }}
                />
              </div>
            </div>
          );
        })}
    </>
  );
};

FeaturedWebinar.propTypes = propTypes;

export default FeaturedWebinar;
