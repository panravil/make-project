// THIS COMPONENT IS NOT BEING USED

import styles from "./TestimonialSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";

import Review from "./Review";
import { Testimonial, AppSlider } from "@components/shared";

const propTypes = {
  footerData: PropTypes.shape({
    testimonialsTitle: PropTypes.string.isRequired,
    footerTestimonialsCollection: PropTypes.shape({
      items: PropTypes.PropTypes.arrayOf(
        PropTypes.shape({
          author: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          jobTitle: PropTypes.string.isRequired,
          authorPhoto: PropTypes.shape({
            height: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
          }),
        })
      ).isRequired,
    }).isRequired,
    reviewsCollection: PropTypes.object.isRequired,
  }),
};

// Component to render the testimonials in a React Slick slider
const FooterTestimonials = ({ footerData }) => {
  const title = _.get(footerData, "testimonialsTitle");
  const reviews = _.get(footerData, "reviewsCollection.items");
  const testimonialsArray = _.get(
    footerData,
    "footerTestimonialsCollection.items"
  );

  // Map to render the reviews that are passed from contentful
  const renderReviews = reviews.map((review, index) => {
    return <Review key={index} review={review} />;
  });

  // Map to render the testimonials that are passed from contentful
  const renderTestimonials = testimonialsArray.map((testimonial, index) => {
    return <Testimonial key={index} fields={testimonial} footer darkMode />;
  });

  return (
    <div className={cn("container", styles.footerTestimonialsContainer)}>
      <h2>{title}</h2>
      <div className={styles.reviewRow}>{renderReviews}</div>
      <AppSlider
        slidesToShow={4}
        slidesToScroll={1}
        className={styles.pageTestimonialSectionImage}
        fullWidth
        darkMode
      >
        {renderTestimonials}
      </AppSlider>
    </div>
  );
};

FooterTestimonials.propTypes = propTypes;

export default FooterTestimonials;
