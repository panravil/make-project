import styles from "./TestimonialSection.module.scss";
import Image from "next/image";
import PropTypes from "prop-types";
import ReviewStar from "@icons/ReviewStar";

const propTypes = {
  review: PropTypes.shape({
    image: PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }),
    description: PropTypes.string.isRequired,
  }),
};

// Component that renders a review card
const Review = ({ review }) => {
  const image = review.image;
  return (
    <div className={styles.reviewContainer}>
      {image.url ? (
        <div className={styles.imageWrapper}>
          <Image
            src={image.url}
            alt={image.title}
            height={28}
            width={(image.width * 28) / image.height}
            quality={90}
          />
        </div>
      ) : null}
      <div className={styles.reviewRating}>
        <ReviewStar />
        <ReviewStar />
        <ReviewStar />
        <ReviewStar />
        <ReviewStar />
      </div>
      <div className="small">{review.description}</div>
    </div>
  );
};

Review.propTypes = propTypes;

export default Review;
