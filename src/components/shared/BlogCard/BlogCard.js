import styles from "./BlogCard.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import { Link } from "@components/common";
import { PageImage } from "@components/page";

const propTypes = {
  slider: PropTypes.bool,
  columns: PropTypes.number,
  blog: PropTypes.shape({
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
    title: PropTypes.string,
  }).isRequired,
  useCase: PropTypes.bool,
  className: PropTypes.object,
};

// Blog Card for the blog index page
const BlogCard = ({ blog, columns, useCase, slider }) => {
  const image = _.get(blog, "image");
  const datePublished = new Date(blog.date).toDateString().split(" ").slice(1);
  datePublished[1] = datePublished[1] + ",";
  const formattedDate = datePublished.join(" ");
  const categories = _.get(blog, "categoriesCollection.items") || [];
  const topics = _.filter(categories, (category) => {
    return category.topic;
  });

  return (
    <Link
      className={cn(
        styles.blogCardContainer,
        slider ? styles.slider : "",
        columns > 1 ? styles.twoColumns : "",
        columns > 2 ? styles.threeColumns : "",
        columns > 3 ? styles.fourColumns : ""
        // ...className
      )}
      link={{
        name: blog.title,
        slug: `/${useCase ? "use-cases" : "blog"}/${blog.slug}`,
      }}
    >
      <div className={cn(styles.contentWrapper, "card-background")}>
        <div className={styles.blogImage}>
          <div className={styles.imageContainer}>
            {image && (
              <div className={styles.imageWrapper}>
                <PageImage image={image} width={687} />
              </div>
            )}
            <div className={styles.topicWrapper}>
              {topics.map((topic, index) => {
                return (
                  <div key={index} className={cn("small", styles.topic)}>
                    {topic.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={cn("small", styles.publishDate)}>
          {formattedDate}
          {blog.readTime
            ? " | " + _.floor(blog.readTime / 60) + " minutes"
            : null}
        </div>
        <strong className={cn("bold", styles.blogTitle)}>{blog.title}</strong>
      </div>
    </Link>
  );
};

BlogCard.propTypes = propTypes;

export default BlogCard;
