import styles from "./PopularBlogs.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cn from "classnames";
import PropTypes from "prop-types";

import { AppSlider, BlogCard, WebinarCard } from "@components/shared";

const propTypes = {
  blogIndexData: PropTypes.shape({
    sliderTitle: PropTypes.string.isRequired,
  }).isRequired,
  allBlogs: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  useCase: PropTypes.bool,
  webinar: PropTypes.bool,
};

// Popular Blogs for the blog index page
const PopularBlogs = ({ blogIndexData, allBlogs, useCase, webinar }) => {
  const filteredItems = allBlogs.reduce((filtered, item, index) => {
    if (webinar && item?.upcoming && index < 4) {
      filtered.push(
        <div key={index}>
          <WebinarCard webinar={item} columns={3} upcoming slider />
        </div>
      );
    } else if (!webinar && index < 4) {
      filtered.push(
        <div key={index}>
          <BlogCard blog={item} columns={3} useCase={useCase} slider />
        </div>
      );
    }
    return filtered;
  }, []);

  return (
    <>
      {filteredItems.length ? (
        <div className={cn("container", styles.popularBlogsContainer)}>
          <h2 className={styles.popularBlogsHeader}>
            {blogIndexData.sliderTitle}
          </h2>
          {allBlogs?.length > 0 ? (
            <AppSlider slidesToScroll={1} slidesToShow={2} arrows>
              {filteredItems}
            </AppSlider>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

PopularBlogs.propTypes = propTypes;

export default PopularBlogs;
