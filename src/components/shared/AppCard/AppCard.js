import styles from "./AppCard.module.scss";
import { Link } from "@components/common";
import PropTypes from "prop-types";
import cn from "classnames";

import { AppIcon } from "@components/shared";

const propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  href: PropTypes.string,
  small: PropTypes.bool,
  smallHorizontal: PropTypes.bool,
};

// Component that returns the App details styled as a card with a link to specific app
const AppCard = ({ app, href, small, smallHorizontal }) => {
  const appLink = {
    name: app.name,
    slug: href ? href : `/integrations/${app.slug}`,
  };

  return (
    <Link
      className={cn(
        styles.appCard,
        smallHorizontal ? styles.appCardSmallHorizontal : "",
        small ? styles.appCardSmall : ""
      )}
      link={appLink}
    >
      <AppIcon
        app={app}
        className={cn(
          styles.appIcon,
          smallHorizontal ? styles.smallHorizontalIcon : ""
        )}
        // dimensions={small ? 48 : 48}
        dimensions={smallHorizontal ? 32 : 48}
      />
      <div className={cn("caption", styles.appName)}>{app.name}</div>
    </Link>
  );
};

AppCard.propTypes = propTypes;

export default AppCard;
