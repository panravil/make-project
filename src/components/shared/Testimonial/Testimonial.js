import styles from "./Testimonial.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { PageImage } from "@components/page";

const propTypes = {
  fields: PropTypes.shape({
    author: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    authorPhoto: PropTypes.object,
  }),
  footer: PropTypes.bool,
  darkMode: PropTypes.bool,
};

// Component to render the individual testimonial for the footer
const Testimonial = ({ fields, footer, darkMode }) => {
  const { description, author, jobTitle, authorPhoto } = fields;
  return (
    <div
      className={cn(
        styles.testimonial,
        footer ? styles.footer : "",
        darkMode ? styles.darkMode : ""
      )}
    >
      <div className={cn("caption", styles.description)}>
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
      <div className={styles.authorContainer}>
        <div className={styles.imageWrapper}>
          {authorPhoto ? <PageImage image={authorPhoto} layout="fill" /> : null}
        </div>
        <div className={styles.authorInfo}>
          <div className={styles.author}>{author}</div>
          <div className={cn("small", styles.jobTitle)}>{jobTitle}</div>
        </div>
      </div>
    </div>
  );
};

Testimonial.propTypes = propTypes;

export default Testimonial;
