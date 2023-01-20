import styles from "./TemplateIcon.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import { AppIcon } from "@components/shared";

const propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  dimensions: PropTypes.number,
  className: PropTypes.string,
};

// Reusable component to render the template icons based on how many apps are passed in
const TemplateIcon = ({ apps, dimensions = 60, className }) => {
  const appDimensions = (dimensions * 5) / 8;
  return (
    <div className={cn(styles.templateIcon, className)}>
      {apps &&
        apps.map((app, index) => {
          return (
            <AppIcon
              key={index}
              app={app}
              className={index === 0 ? styles.appIcon : styles.appIcon2}
              dimensions={appDimensions}
            />
          );
        })}
    </div>
  );
};

TemplateIcon.propTypes = propTypes;

export default TemplateIcon;
