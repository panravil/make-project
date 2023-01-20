import styles from "../NavHeader/NavHeader.module.scss";
import PropTypes from "prop-types";
import NavLink from "@components/common/NavHeader/NavLink";
import cn from "classnames";
import { renderIcon } from "@components/common/Dropdown/iconSwitch";

const propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.object,
  index: PropTypes.number,
  handleClick: PropTypes.func,
};

const MobileDropdown = ({ title, link, index, handleClick }) => {
  return (
    <li className={cn(styles.menuLink)}>
      <div className={styles.menuLinkContainer}>
        <div className={cn(styles.linkHeader, styles.menuLinkContainer)}>
          <div>{title}</div>
        </div>
      </div>
      {link.megaMenuColumnsCollection.items[0]?.columnLinksCollection.items ? (
        <ul className={styles.submenuList}>
          {link.megaMenuColumnsCollection.items[0]?.columnLinksCollection.items.map(
            (link, index) => {
              return (
                <li key={index} onClick={handleClick}>
                  <NavLink
                    href={link.slug}
                    dataCta={link.dataCta}
                    dataRole={link.dataRole}
                    className={styles.linkContainer}
                    external={link.external}
                    onClick={handleClick}
                  >
                    {renderIcon(link.name, styles.icons)}
                    <span className={styles.mobileLink}>{link.name}</span>
                  </NavLink>
                </li>
              );
            }
          )}
        </ul>
      ) : (
        <ul className={styles.submenuList}>
          <li key={index} onClick={handleClick}>
            <NavLink
              href={link.link.slug}
              dataCta={link.link.dataCta}
              dataRole={link.link.dataRole}
              className={styles.linkContainer}
              external={link.external}
            >
              {renderIcon(link.link.name, styles.icons)}
              <span className={styles.mobileLink}>{link.link.name}</span>
            </NavLink>
          </li>
        </ul>
      )}
    </li>
  );
};

MobileDropdown.propTypes = propTypes;

export default MobileDropdown;
