import styles from "./RelatedBlogs.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import { BlogCard } from "@components/shared";
import { AppSlider } from "@components/shared";

const propTypes = {
  relatedBlogs: PropTypes.array.isRequired,
  useCase: PropTypes.bool,
};

// Related Blogs for the blog index page
const RelatedBlogs = ({ relatedBlogs, useCase }) => {
  // function that returns an array of blogs with styling
  const renderRelatedBlogs = relatedBlogs.map((blog, index) => {
    return (
      <div key={index}>
        <BlogCard blog={blog} useCase={useCase} slider />
      </div>
    );
  });

  return (
    <div className={cn("container", styles.relatedBlogContainer)}>
      <h4>Related Blogs</h4>
      <AppSlider
        arrows
        slidesToScroll={1}
        slidesToShow={relatedBlogs.length < 3 ? relatedBlogs.length : 3}
      >
        {renderRelatedBlogs}
      </AppSlider>
    </div>
  );
};

RelatedBlogs.propTypes = propTypes;

export default RelatedBlogs;
