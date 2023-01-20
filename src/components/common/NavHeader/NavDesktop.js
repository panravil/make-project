import styles from "./NavHeader.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import Dropdown from "@components/common/Dropdown/DropdownHeader";

const propTypes = {
  navbarData: PropTypes.shape({
    menuLinksCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          link: PropTypes.object.isRequired,
          megaMenuColumnsCollection: PropTypes.shape({
            items: PropTypes.arrayOf(
              PropTypes.shape({
                icon: PropTypes.object,
                iconTitle: PropTypes.string,
                iconDescription: PropTypes.string,
                columnTitle: PropTypes.string,
                columnLinksCollection: PropTypes.object,
                imageTitle: PropTypes.string,
                image: PropTypes.object,
              })
            ),
          }),
        })
      ),
    }),
    showMegaMenu: PropTypes.bool,
  }),
  darkNav: PropTypes.bool,
};

// desktop nav component to render on larger screens
const NavDesktop = ({ navbarData, darkNav }) => {
  const menuLinks = _.get(navbarData, "menuLinksCollection.items");
  return (
    <nav className={cn(styles.desktopNav, darkNav ? styles.darkNav : "")}>
      <ul>
        {menuLinks.map((link, index) => {
          return (
            <Dropdown
              isHoverable={
                link.megaMenuColumnsCollection.items[0]?.columnLinksCollection
                  .items
              }
              title={link.link.name}
              link={link}
              external={link.link.external}
              isLink={true}
              key={index}
            />
          );
        })}
      </ul>
    </nav>
  );
};

NavDesktop.propTypes = propTypes;

export default NavDesktop;
