import styles from "./PageFaqSection.module.scss";
import _ from "lodash";
import PropTypes from "prop-types";
import cn from "classnames";
import ReactMarkdown from "react-markdown";

import { Link, Toggle } from "@components/common";
import { PageSectionWrapper } from "@components/page";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    questionEntry: PropTypes.arrayOf(
      PropTypes.shape({
        fields: PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      }).isRequired
    ),
    questionEntryCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        })
      ),
    }),
    link: PropTypes.object,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
};

// Component to handle the Frequently Asked Questions section on the pricing page
const PageFaqSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const linkLabel = _.get(fields, "linkLabel");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const faqEntries = _.get(fields, "questionEntry")
    ? (_.get(fields, "questionEntry") || []).map((entry) => {
        return entry.fields;
      })
    : _.get(fields, "questionEntryCollection.items") || [];

  // Map to render all of the questions and answers
  const renderQuestion = faqEntries.map((question, index) => {
    return (
      <Toggle
        key={index}
        title={question.title}
        textChildren={question.description}
      />
    );
  });

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div className={cn("container", styles.faqSection)}>
        {subtitle ? <p>{subtitle}</p> : null}
        {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
        {description ? (
          <div className={cn("body-large", styles.description)}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ) : null}
        <div className={styles.faqContainer}>{renderQuestion}</div>
        {linkLabel && _.get(link, "slug") ? (
          <div className={styles.linkContainer}>
            <div className={styles.linkLabel}>{linkLabel}</div>
            <Link link={link} className="bold">
              {_.get(link, "name")}
            </Link>
          </div>
        ) : (
          _.get(link, "slug") && (
            <Link link={link} className="button gradient-outline">
              <div className="gradient-inner">{_.get(link, "name")}</div>
            </Link>
          )
        )}
      </div>
    </PageSectionWrapper>
  );
};

PageFaqSection.propTypes = propTypes;

export default PageFaqSection;
