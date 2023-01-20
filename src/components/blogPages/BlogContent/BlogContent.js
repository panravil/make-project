import styles from "./BlogContent.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import renderRichTextOptions from "@utils/renderRichTextOptions";

const propTypes = {
  blogData: PropTypes.shape({
    author: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
    showRichtext: PropTypes.bool,
    legacyContent: PropTypes.string,
    bodyText: PropTypes.object,
  }).isRequired,
};

// Blog Details page component
const BlogDetails = ({ blogData }) => {
  const legacyContent = _.get(blogData, "legacyContent");
  const bodyText = _.get(blogData, "bodyText");

  return (
    <div className={cn("container", styles.bodyContentContainer)}>
      <div className={styles.bodyContent}>
        {blogData.showRichtext && bodyText?.json ? (
          documentToReactComponents(
            bodyText?.json,
            renderRichTextOptions(bodyText?.links)
          )
        ) : legacyContent ? (
          <div
            className={styles.legacyContent}
            dangerouslySetInnerHTML={{ __html: legacyContent }}
          />
        ) : bodyText?.json ? (
          documentToReactComponents(
            bodyText?.json,
            renderRichTextOptions(bodyText?.links)
          )
        ) : null}
      </div>
    </div>
  );
};

BlogDetails.propTypes = propTypes;

export default BlogDetails;
