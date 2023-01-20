import React, { useRef } from "react";
import styles from "./PageCardSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { Link } from "@components/common";
import { PageCard, PageContainer, PageSectionWrapper } from "@components/page";
import SelectArrow from "@icons/SelectArrow";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    cards: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    cardImageTop: PropTypes.bool,
    cardTransparent: PropTypes.bool,
    cardGradientBorder: PropTypes.bool,
    columns: PropTypes.number,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
};

// Component that renders the Connect Apps section of the home page
const PageCardSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const cards = _.get(fields, "cards");
  const id = _.get(fields, "sectionId");
  const cardImageTop = _.get(fields, "cardImageTop");
  const cardTransparent = _.get(fields, "cardTransparent");
  const cardGradientBorder = _.get(fields, "cardGradientBorder");
  const columns = _.get(fields, "columns");
  const horizontalScrollRow = columns === 0;

  // ref and function to control how much the user scrolls on click
  const rowRef = useRef(null);
  const handleArrowClick = () => {
    const current = rowRef.current;
    if (current) {
      current.scrollLeft += 200;
    }
  };

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <PageContainer
        id={id}
        animateBottom
        className={cn(
          styles.pageCardSection,
          horizontalScrollRow ? styles.horizontalScrollRow : ""
        )}
      >
        {subtitle ? <p>{subtitle}</p> : null}
        {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
        {description ? (
          <div className={cn("body-large", styles.description)}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ) : null}
        <div className={styles.pageCardRowWrapper}>
          <div
            className={
              id === "become-partner"
                ? cn(
                    styles.pageCardRowPartners,
                    horizontalScrollRow ? styles.showScrollbar : ""
                  )
                : cn(
                    styles.pageCardRow,
                    horizontalScrollRow ? styles.showScrollbar : ""
                  )
            }
            ref={rowRef}
          >
            {cards.map((card, index) => {
              const fields = _.get(card, "fields");
              return (
                <PageCard
                  key={index}
                  fields={fields}
                  cardImageTop={cardImageTop}
                  cardTransparent={cardTransparent}
                  cardGradientBorder={cardGradientBorder}
                  columns={columns}
                />
              );
            })}
          </div>
          {horizontalScrollRow ? (
            <div
              className={styles.arrowIcon}
              onClick={handleArrowClick}
              onKeyPress={handleArrowClick}
              role="button"
              tabIndex={0}
            >
              <SelectArrow />
            </div>
          ) : null}
        </div>
        {_.get(link, "slug") && (
          <Link link={link} className={cn("button gradient", styles.ctaLink)} />
        )}
      </PageContainer>
    </PageSectionWrapper>
  );
};

PageCardSection.propTypes = propTypes;

export default PageCardSection;
