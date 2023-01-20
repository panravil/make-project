import { useState } from "react";
import styles from "./Toggle.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import SelectArrow from "@icons/SelectArrow";

const propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element,
  textChildren: PropTypes.string,
  titleClassName: PropTypes.string,
  showContentStart: PropTypes.bool,
};

// Component to show/hide content based on the toggle state
// title is clickable and reveals the content that is passed as childred.
const Toggle = ({
  title,
  children,
  textChildren,
  titleClassName,
  showContentStart = false,
}) => {
  const [showContent, setShowContent] = useState(showContentStart);
  return (
    <div
      className={cn(
        styles.toggle,
        showContent ? styles.toggleOpen : "",
        "card-background"
      )}
    >
      <div
        className={cn("h6", styles.toggleTitle, titleClassName)}
        onClick={() => setShowContent(!showContent)}
        onKeyPress={() => setShowContent(!showContent)}
        role="button"
        tabIndex={0}
        aria-label="toggle FAQ window"
      >
        {title}
        <div className={styles.toggleArrow}>
          <SelectArrow />
        </div>
      </div>
      <div className={styles.toggleDescription}>
        {showContent && (
          <ReactMarkdown>{textChildren && textChildren}</ReactMarkdown>
        )}
        {showContent && <>{children && children}</>}
      </div>
    </div>
  );
};

Toggle.propTypes = propTypes;

export default Toggle;
