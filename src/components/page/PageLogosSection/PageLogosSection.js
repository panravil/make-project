import styles from "./PageLogosSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import { PageImage, PageSectionWrapper } from "@components/page";
import ReviewStar from "@icons/ReviewStar";

const propTypes = {
  fields: PropTypes.shape({
    title: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.object.isRequired),
    imageCollection: PropTypes.arrayOf(PropTypes.object.isRequired),
    reviewMode: PropTypes.bool,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
};

// Home Page Header Component
const PageLogosSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const images =
    _.get(fields, "images") || _.get(fields, "imagesCollection.items");
  const reviewMode = _.get(fields, "reviewMode");

  // Renders the images that appear in the header to show what
  // trusted businesses they work with
  const renderTrustedLogos = images?.map((image, index) => {
    if (reviewMode) {
      return (
        <div key={index} className={styles.reviewCard}>
          <div className={styles.imageWrapper}>
            <PageImage image={image} width={48} />
          </div>
          <div className={styles.reviewText}>
            <div className={cn(styles.title, "h6")}>
              {_.get(image, "fields.title")}
            </div>
            <div className={styles.reviewStars}>
              <ReviewStar />
              <ReviewStar />
              <ReviewStar />
              <ReviewStar />
              <ReviewStar />
            </div>
            <div className="small">{_.get(image, "fields.description")}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div key={index} className={styles.businessLogo}>
          <PageImage image={image} layout="fixed" height={32} />
        </div>
      );
    }
  });

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div
        className={cn(
          "container",
          styles.logosContainer,
          reviewMode ? styles.reviewMode : ""
        )}
      >
        {index === 0 ? <h1>{title}</h1> : <h2 className={"h4"}>{title}</h2>}
        <div className={styles.logosRow}>{renderTrustedLogos}</div>
      </div>
    </PageSectionWrapper>
  );
};

PageLogosSection.propTypes = propTypes;

export default PageLogosSection;
