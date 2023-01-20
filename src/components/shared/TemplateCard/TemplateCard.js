import styles from "./TemplateCard.module.scss";
import cn from "classnames";
import _ from "lodash";
import { Link } from "@components/common";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { TemplateIcon } from "@components/shared";

const propTypes = {
  template: PropTypes.shape({
    appsCollection: PropTypes.shape({
      items: PropTypes.array.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    usage: PropTypes.number.isRequired,
  }),
};

// Template card that can be used to display
// results from the templatesSearch
const TemplateCard = ({ template }) => {
  const appsIncludedArray = _.get(template, "appsCollection.items");
  const templateLink = {
    slug: `/templates/${template.slug}`,
    name: template.name,
  };
  return (
    <Link className={styles.templateCard} link={templateLink}>
      <div className={cn(styles.contentWrapper, "card-background")}>
        <div>
          <TemplateIcon
            apps={appsIncludedArray}
            className={styles.templateIcon}
          />
          <div className={cn("h6", styles.title)}>{template?.name}</div>
          <ReactMarkdown className={cn("caption", styles.description)}>
            {template?.description}
          </ReactMarkdown>
        </div>
        <div className="link bold">Try It {"➔"}</div>
      </div>
    </Link>
  );
};

TemplateCard.propTypes = propTypes;

export default TemplateCard;
