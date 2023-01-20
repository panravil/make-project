import React, { useState } from "react";
import styles from "./PageTabSection.module.scss";
import cn from "classnames";
// import Image from "next/image";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { Link } from "@components/common";
import { PageCard, PageSectionWrapper } from "@components/page";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        fields: PropTypes.shape({
          title: PropTypes.string.isRequired,
          cards: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
        }),
      }).isRequired
    ).isRequired,
    cardImageTop: PropTypes.bool,
    columns: PropTypes.number,
  }).isRequired,
  index: PropTypes.number,
};

// Component that renders the Connect Apps section of the home page
const PageTabSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const tabs = _.get(fields, "tabs") || [];
  const [selectedTab, setSelectedTab] = useState(0);
  const cardImageTop = _.get(fields, "cardImageTop");
  const columns = _.get(fields, "columns");

  const renderTab = (tab, index) => {
    const title = _.get(tab, "fields.title");
    return (
      <div
        key={index}
        className={cn(
          styles.tabTitle,
          index === selectedTab ? styles.selectedTab : "",
          "heading"
        )}
        onClick={() => setSelectedTab(index)}
        onKeyPress={() => setSelectedTab(index)}
        role="button"
        tabIndex={0}
      >
        {title}
      </div>
    );
  };

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div className={cn("container", styles.pageTabSection)}>
        {subtitle ? <p>{subtitle}</p> : null}
        {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
        {description ? (
          <div className={cn("body-large", styles.description)}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ) : null}
        <div className={styles.tabTitleRow}>
          {tabs.map((tab, index) => renderTab(tab, index))}
        </div>
        <div className={styles.tabItemsRow}>
          {(_.get(tabs[selectedTab], "fields.cards") || []).map(
            (card, index) => {
              const fields = _.get(card, "fields");
              return (
                <PageCard
                  key={index}
                  fields={fields}
                  cardImageTop={cardImageTop}
                  columns={columns}
                />
              );
            }
          )}
        </div>
        {_.get(link, "slug") && (
          <Link link={link} className={cn("button gradient", styles.ctaLink)} />
        )}
      </div>
    </PageSectionWrapper>
  );
};

PageTabSection.propTypes = propTypes;

export default PageTabSection;
