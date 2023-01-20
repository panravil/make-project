import React, { useState } from "react";
import styles from "./Tooltip.module.scss";
import cn from "classnames";
import { isMobile, isBrowser } from "react-device-detect";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.object.isRequired,
  content: PropTypes.string,
  direction: PropTypes.string,
};

// Reusable Tooltip component
const Tooltip = ({ children, content, direction }) => {
  const [active, setActive] = useState(false);

  // Functions to control the hide and show behavior of the tool tip
  const showTip = () => {
    if (isBrowser) {
      setActive(true);
    }
  };
  const hideTip = () => {
    if (isBrowser) {
      setActive(false);
    }
  };
  const clickTip = () => {
    if (isMobile) {
      setActive(!active);
    }
  };

  return (
    <div
      className={styles.tooltipWrapper}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      onClick={clickTip}
      onKeyPress={clickTip}
      aria-label="Tooltip"
      role="button"
      tabIndex={0}
    >
      {children}
      {active && (
        <div
          className={cn(
            "small",
            styles.tooltipHint,
            direction && styles[direction]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = propTypes;

export default Tooltip;
