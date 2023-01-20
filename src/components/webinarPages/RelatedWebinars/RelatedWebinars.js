import styles from "./RelatedWebinars.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import { AppSlider, WebinarCard } from "@components/shared";

const propTypes = {
  relatedBlogs: PropTypes.array.isRequired,
  relatedTitle: PropTypes.string.isRequired,
};

// Related Blogs for the blog index page
const RelatedWebinars = ({ relatedWebinars, relatedTitle }) => {
  // function that returns an array of blogs with styling
  const renderRelatedWebinars = relatedWebinars.map((webinar, index) => {
    return (
      <div key={index}>
        <WebinarCard webinar={webinar} />
      </div>
    );
  });

  return (
    <div className={cn("container", styles.relatedBlogContainer)}>
      <h4>{relatedTitle}</h4>
      <AppSlider
        arrows
        slidesToScroll={1}
        slidesToShow={relatedWebinars.length < 3 ? relatedWebinars.length : 3}
      >
        {renderRelatedWebinars}
      </AppSlider>
    </div>
  );
};

RelatedWebinars.propTypes = propTypes;

export default RelatedWebinars;
