import styles from "./NavHeader.module.scss";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  disableBodyScroll,
  clearAllBodyScrollLocks,
  enableBodyScroll,
} from "body-scroll-lock";
import cn from "classnames";
import PropTypes from "prop-types";
import { Link, BasicLink } from "@components/common";
import MenuIcon from "@icons/MenuIcon";
import getWindowWidth from "@utils/getWindowWidth";
import MobileDropdown from "@components/common/Dropdown/MobileDropdown";

const propTypes = {
  links: PropTypes.array.isRequired,
  signUpLinks: PropTypes.arrayOf(PropTypes.object),
  navbarOpen: PropTypes.bool.isRequired,
  setNavbarOpen: PropTypes.func.isRequired,
  navbarOpacity: PropTypes.number,
  darkNav: PropTypes.bool,
};

// Mobile Nav component to be rendered for smaller screens
const NavMobile = ({
  links,
  signUpLinks,
  navbarOpen,
  setNavbarOpen,
  navbarOpacity,
  darkNav,
}) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const ref = useRef();
  // scrollLock to stop user from scrolling if the mobile menu is opened
  // https://www.npmjs.com/package/body-scroll-lock
  useEffect(() => {
    if (ref.current) {
      if (navbarOpen) {
        disableBodyScroll(ref.current);
      } else {
        enableBodyScroll(ref.current);
      }
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [navbarOpen]);

  const windowWidth = getWindowWidth();

  // useEffect that watches for window width and if it grows greater than
  // tablet use, close the nav bar
  useEffect(() => {
    if (windowWidth >= 768) {
      if (navbarOpen) {
        setNavbarOpen(false);
      }
    }
  }, [windowWidth]);

  // function to close menu
  const closeMenu = () => {
    if (navbarOpen) {
      setNavbarOpen(false);
    }
  };

  // function to open or close
  const toggleMenu = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <nav className={cn(styles.mobileNav, navbarOpen ? styles.show : "")}>
      <div
        className={cn(
          styles.menuToggle,
          isHomePage && !navbarOpen && navbarOpacity <= 0
            ? styles.homePageTop
            : ""
        )}
        role="button"
        aria-label="Toggle Menu"
        tabIndex={0}
        onClick={toggleMenu}
        onKeyPress={toggleMenu}
      >
        <MenuIcon navbarOpen={navbarOpen} />
      </div>
      <section
        className={cn(styles.flyoutMenu, darkNav ? "white-override" : "")}
      >
        <div className={cn("container", styles.flyoutMenuContainer)} ref={ref}>
          <ul>
            {links.map((key, index) => (
              <MobileDropdown
                key={index}
                title={key.link.name}
                link={key}
                handleClick={closeMenu}
              />
            ))}
          </ul>
          {signUpLinks[0] ? (
            <BasicLink
              link={signUpLinks[0]}
              className={cn(
                "button gradient-outline full-width",
                styles.startedButton,
                styles.helperMargin
              )}
            >
              <div className="gradient-inner">{signUpLinks[0]?.name}</div>
            </BasicLink>
          ) : null}
          {signUpLinks[1] ? (
            <BasicLink
              link={signUpLinks[1]}
              className={cn("button gradient full-width", styles.startedButton)}
            />
          ) : null}
          {signUpLinks[1] ? (
            <BasicLink link={signUpLinks[3]} className={styles.signInLink} />
          ) : null}
        </div>
      </section>
    </nav>
  );
};

NavMobile.propTypes = propTypes;

export default NavMobile;
