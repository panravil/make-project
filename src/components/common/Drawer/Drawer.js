import styles from "../ShareDrawer/ShareDrawer.module.scss";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.object,
};

// Custom Drawer Component that takes children as a prop to
// populate the internal content of the drawer

const Drawer = ({ children }) => {
  return (
    <section>
      <div className={styles.drawerContent}>{children}</div>
    </section>
  );
};

Drawer.propTypes = propTypes;

export default Drawer;
