import styles from "./Breadcrumb.module.scss";
import cn from "classnames";
import _ from "lodash";
import { Link } from "@components/common";
import PropTypes from "prop-types";
import BackArrow from "@icons/BackArrow";

const propTypes = {
  link: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  linkProps: PropTypes.object,
};

const Breadcrumb = ({ link, linkProps }) => {
  if (!linkProps) {
    linkProps = {};
  }

  return (
    <div
      data-cy="Breadcrumb"
      className={cn("container", styles.breadcrumbContainer)}
    >
      <Link className={styles.link} link={link} {...linkProps}>
        <BackArrow /> {link.name}
      </Link>
    </div>
  );
};

Breadcrumb.propTypes = propTypes;

export default Breadcrumb;
