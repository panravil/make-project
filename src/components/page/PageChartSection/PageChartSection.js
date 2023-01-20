import styles from "./PageChartSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { Link } from "@components/common";
import { PageTable, PageSectionWrapper } from "@components/page";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    chartOnly: PropTypes.bool,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
};

// Component that renders the Connect Apps section of the home page
const PageChartSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const chartOnly = _.get(fields, "chartOnly");

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div className={cn("container", styles.pageChartRow)}>
        {!chartOnly ? (
          <>
            {subtitle ? <p>{subtitle}</p> : null}
            {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
            {description ? (
              <div className={cn("body-large", styles.description)}>
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            ) : null}
          </>
        ) : null}
        <PageTable fields={fields} />
        {!chartOnly && _.get(link, "slug") && (
          <Link link={link} className={cn("button gradient", styles.ctaLink)} />
        )}
      </div>
    </PageSectionWrapper>
  );
};

PageChartSection.propTypes = propTypes;

export default PageChartSection;
