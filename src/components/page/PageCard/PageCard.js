import React from "react";
import styles from "./PageCard.module.scss";
import cn from "classnames";
// import Image from "next/image";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { Link } from "@components/common";
import { PageImage } from "@components/page";

const propTypes = {
  fields: PropTypes.shape({
    image: PropTypes.object,
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
  }).isRequired,
  cardImageTop: PropTypes.bool,
  cardTransparent: PropTypes.bool,
  cardGradientBorder: PropTypes.bool,
  columns: PropTypes.number,
};

// Component that renders the Connect Apps section of the home page
const PageCard = ({
  fields,
  columns,
  cardImageTop,
  cardTransparent,
  cardGradientBorder,
}) => {
  const image = _.get(fields, "image");
  const subtitle = _.get(fields, "subtitle");
  const title = _.get(fields, "title");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const horizontalScrollRow = columns === 0;
  // Programatically render the card contents based on what's passed in as props
  const cardContents = (
    <>
      {image ? (
        <div className={styles.pageCardImage}>
          <PageImage image={image} layout="fixed" width={64} />
        </div>
      ) : null}
      <div className={styles.pageCardText}>
        {subtitle ? (
          <div className={cn("small", styles.pageCardSubtitle)}>{subtitle}</div>
        ) : null}
        <div className={cn("h6", styles.pageCardTitle)}>{title}</div>
        {description ? (
          <ReactMarkdown className={styles.pageCardDesription}>
            {description}
          </ReactMarkdown>
        ) : null}
        {link ? (
          <div link={link} className={cn("link bold", styles.pageCardLink)} >
            <span>{link?.name}</span>
          </div>
        ) : null}
      </div>
    </>
  );
  if (link) {
    return (
      <Link
        link={link}
        className={cn(
          styles.pageCardContainer,
          styles.linkContainer,
          !cardTransparent ? "card-background" : "",
          cardImageTop ? styles.cardImageTop : "",
          cardGradientBorder ? styles.cardGradientBorder : "",
          columns > 1 ? styles.twoColumns : "",
          columns > 2 ? styles.threeColumns : "",
          columns > 3 ? styles.fourColumns : "",
          horizontalScrollRow ? styles.horizontalScrollRow : "",
          !description ? styles.smallCard : ""
        )}
      >
        {cardGradientBorder ? (
          <div
            className={cn(
              styles.cardGradientContent,
              !cardTransparent ? "card-background" : ""
            )}
          >
            {cardContents}
          </div>
        ) : (
          cardContents
        )}
      </Link>
    );
  } else {
    return (
      <div
        className={cn(
          styles.pageCardContainer,
          !cardTransparent ? "card-background" : "",
          cardImageTop ? styles.cardImageTop : "",
          cardGradientBorder ? styles.cardGradientBorder : "",
          columns > 1 ? styles.twoColumns : "",
          columns > 2 ? styles.threeColumns : "",
          columns > 3 ? styles.fourColumns : "",
          horizontalScrollRow ? styles.horizontalScrollRow : "",
          !description ? styles.smallCard : ""
        )}
      >
        {cardGradientBorder ? (
          <div
            className={cn(
              styles.cardGradientContent,
              !cardTransparent ? "card-background" : ""
            )}
          >
            {cardContents}
          </div>
        ) : (
          cardContents
        )}
      </div>
    );
  }
};

PageCard.propTypes = propTypes;

export default PageCard;
