import { useState, useEffect } from "react";
import styles from "./ToggleAccordion.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import SelectArrow from "@icons/SelectArrow";

const propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element,
  titleClassName: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  showContentStart: PropTypes.bool,
};

// Component to show/hide content based on the toggle state
// title is clickable and reveals the content that is passed as children.
const Toggle = ({
  title,
  children,
  titleClassName,
  onClick,
  index,
  selectedIndex,
  showContentStart = false,
}) => {
  const [showContent, setShowContent] = useState(showContentStart);

  // useEffect to show the content of the selected item
  useEffect(() => {
    if (index === selectedIndex) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [index, selectedIndex]);

  return (
    <div className={styles.toggleAccordian}>
      <div
        className={cn(
          "caption",
          styles.toggleTitle,
          showContent ? styles.toggleOpen : "",
          titleClassName
        )}
        onClick={onClick}
        onKeyPress={onClick}
        role="button"
        tabIndex={0}
        aria-label="toggle"
      >
        <div className={styles.toggleArrow}>
          <SelectArrow />
        </div>
        {title}
      </div>
      {showContent && children}
    </div>
  );
};

Toggle.propTypes = propTypes;

export default Toggle;
