import { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import styles from "./PageContainer.module.scss";
import VisibilitySensor from "react-visibility-sensor";

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.array.isRequired,
  ]).isRequired,
  animateBottom: PropTypes.bool,
  animateLeft: PropTypes.bool,
  animateRight: PropTypes.bool,
  id: PropTypes.string,
};

// Component that renders the Connect Apps section of the home page
const PageContainer = ({
  animateBottom,
  animateLeft,
  animateRight,
  className,
  children,
  id,
}) => {
  const [animate, setAnimate] = useState(false);
  const onChange = (isVisible) => {
    if (isVisible && !animate) {
      setAnimate(true);
    }
  };

  return (
    <VisibilitySensor onChange={onChange} partialVisibility>
      <div
        id={id}
        className={cn(
          "container",
          animateBottom ? "animate-bottom" : "",
          animateLeft ? "animate-left" : "",
          animateRight ? "animate-right" : "",
          animate ? "fire-animation" : "",
          className,
          styles.scroll
        )}
      >
        {children}
      </div>
    </VisibilitySensor>
  );
};

PageContainer.propTypes = propTypes;

export default PageContainer;
