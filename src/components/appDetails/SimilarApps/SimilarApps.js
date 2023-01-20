import styles from "./SimilarApps.module.scss";
import PropTypes from "prop-types";
import { AppCard } from "@components/shared";
import cn from "classnames";

const propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

// Component for similar apps section on Apps Details Page
const SimilarApps = ({ apps }) => {
  // returns a map of all app cards styled if there are any
  const renderSimilarApps =
    apps.length > 0 ? (
      apps.map((app, index) => {
        return (
          <div
            data-cy="SimilarApp"
            key={index}
            className={styles.appCardWrapper}
          >
            <AppCard app={app} />
          </div>
        );
      })
    ) : (
      <div>No Similar Apps</div>
    );

  return (
    <div data-cy="SimilarApps" className={cn("container", styles.similarApps)}>
      <h2 className={styles.similarAppHeader}>Similar Apps</h2>
      <div className={styles.appContainer}>{renderSimilarApps}</div>
    </div>
  );
};

SimilarApps.propTypes = propTypes;

export default SimilarApps;
