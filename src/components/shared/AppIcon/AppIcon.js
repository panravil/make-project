import styles from "./AppIcon.module.scss";
import cn from "classnames";
import _ from "lodash";
import Image from "next/image";
import PropTypes from "prop-types";

const propTypes = {
  app: PropTypes.shape({
    icon: PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    theme: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  iconWrapperClassName: PropTypes.string,
  dimensions: PropTypes.number,
};

// Component that returns the App Icon styled with the apps theme color behind it
const AppIcon = ({ app, className, iconWrapperClassName, dimensions = 48 }) => {
  const icon = _.get(app, "icon");
  const iconDimensions = (dimensions * 2) / 3;
  return (
    <div
      className={cn(styles.iconBackground, className)}
      style={{ backgroundColor: app?.theme }}
    >
      <div className={cn(styles.iconWrapper, iconWrapperClassName)}>
        <div>
          {icon?.url ? (
            <Image
              src={icon.url}
              alt={icon.title}
              layout="responsive"
              sizes={`${iconDimensions / 10}rem`}
              height={(icon.height * iconDimensions) / icon.width}
              width={iconDimensions}
              quality={90}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

AppIcon.propTypes = propTypes;

export default AppIcon;
