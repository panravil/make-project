import styles from "./WebinarCard.module.scss";
import cn from "classnames";
import _ from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import { Link } from "@components/common";
import { PageImage } from "@components/page";
import PlayVideo from "@icons/PlayVideo";

const propTypes = {
  slider: PropTypes.bool,
  columns: PropTypes.number,
  webinar: PropTypes.shape({
    categoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
          topic: PropTypes.bool,
        })
      ),
    }),
    date: PropTypes.string.isRequired,
    image: PropTypes.shape({
      height: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
    readTime: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  upcoming: PropTypes.bool,
};

// Webinar Card for the webinar index page
const WebinarCard = ({ webinar, columns, upcoming, slider }) => {
  const image = _.get(webinar, "image");
  const formattedDate = moment(webinar.date)
    .tz(moment.tz.guess())
    .format("MMMM Do, YYYY, h:mm a z");
  return (
    <Link
      className={cn(
        styles.webinarCardContainer,
        slider ? styles.slider : "",
        columns > 1 ? styles.twoColumns : "",
        columns > 2 ? styles.threeColumns : "",
        columns > 3 ? styles.fourColumns : ""
      )}
      link={{
        name: webinar?.title,
        slug: `/webinars/${webinar?.slug}`,
      }}
    >
      <div className={cn(styles.contentWrapper, "card-background")}>
        <div className={styles.webinarImage}>
          {webinar?.lengthMinutes ? (
            <div className={cn("small", styles.lengthMinutes)}>
              {webinar?.lengthMinutes} min
            </div>
          ) : null}
          <div className={styles.imageContainer}>
            {image ? (
              <div className={styles.imageWrapper}>
                <PageImage image={image} width={687} />
              </div>
            ) : (
              <PlayVideo />
            )}
          </div>
        </div>
        {upcoming ? (
          <>
            <div className={cn("h4", styles.upcomingTitle)}>
              {webinar?.name}
            </div>
            <div className={cn("small", styles.upcomingDate)}>
              {formattedDate}
            </div>
            <div className="link bold">{"Learn more ➔"}</div>
          </>
        ) : (
          <>
            <div className={cn("small", styles.webinarInfo)}>
              {/* only 1st category */}
              {webinar.categoriesCollection.items.length > 0 ? (
                <span className={cn("small", styles.webinarCategory)}>
                  {webinar?.categoriesCollection.items[0].name}
                </span>
              ) : null}
              {webinar?.categoriesCollection.items.length > 0 &&
              webinar.language
                ? " | "
                : null}
              {webinar.language ? (
                <span className={cn("small", styles.webinarLanguage)}>
                  {(webinar.language === "en" && "English") ||
                    (webinar.language === "es" && "Español") ||
                    (webinar.language === "cs" && "Česky") ||
                    (webinar.language === "it" && "Italiano") ||
                    (webinar.language === "fr" && "Français") ||
                    webinar.language}
                </span>
              ) : null}
            </div>
            <strong className={cn("bold", styles.webinarTitle)}>
              {webinar?.name}
            </strong>
          </>
        )}
      </div>
    </Link>
  );
};

WebinarCard.propTypes = propTypes;

export default WebinarCard;
