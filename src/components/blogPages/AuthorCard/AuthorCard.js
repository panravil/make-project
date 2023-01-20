import styles from "./AuthorCard.module.scss";
import Image from "next/image";

import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import { Link } from "@components/common";

const propTypes = {
  author: PropTypes.shape({
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    // TODO: Author Card links out to somewhere?
    link: PropTypes.object,
  }),
};

// Blog Card for the blog index page
const AuthorCard = ({ author }) => {
  const image = _.get(author, "image");
  const description = _.get(author, "description") || "";

  // Function that checks if there is a description, renders it, or renders nothing if there isnt one
  const renderDescription =
    description.length > 0 ? (
      description.charAt(0) === "<" &&
      description.charAt(description.length - 1) === ">" ? (
        <div
          className={styles.authorDescription}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <div className={styles.authorDescription}>{description}</div>
      )
    ) : null;

  return (
    <div
      className={cn(
        "container",
        styles.authorCardContainer,
        styles[author?.authorCardContainer]
      )}
    >
      <div className={styles.imageContainer}>
        <Image
          src={image.url}
          alt={image.title}
          layout="responsive"
          sizes={"16.6rem"}
          height={(image.height * 166) / image.width}
          width={166}
          quality={90}
        />
      </div>
      <div className={styles.authorBio}>
        <h3 className={styles.authorName}>{author.name}</h3>
        {renderDescription}
        {_.get(author, "link.slug") && (
          <Link className="bold" link={author.link} />
        )}
      </div>
    </div>
  );
};

AuthorCard.propTypes = propTypes;

export default AuthorCard;
