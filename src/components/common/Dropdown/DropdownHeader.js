import _ from "lodash";
import { useRef } from "react";
import Image from "next/image";
import cn from "classnames";
import PropTypes from "prop-types";
import { IoChevronDownSharp } from "react-icons/io5";

import styles from "./Dropdown.module.scss";
import NavLink from "@components/common/NavHeader/NavLink";
import navStyles from "@components/common/NavHeader/NavHeader.module.scss";
import { renderIcon } from "./iconSwitch";
import ClickOutside from "@utils/clickOutside";
import makeLogo from "../../../../public/logos/makeLogo.svg";
import integromatLogo from "../../../../public/logos/integromatLogo.svg";

const propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.object,
  isLogin: PropTypes.bool,
  isHoverable: PropTypes.array,
  index: PropTypes.number,
  loginSlug: PropTypes.string,
  showLoginHover: PropTypes.bool,
  setShowLoginHover: PropTypes.func,
};

const Dropdown = ({
  title,
  link,
  isLogin,
  isHoverable,
  index,
  navbarData,
  loginSlug,
  showLoginHover,
  setShowLoginHover,
}) => {
  const loginHoverContentRef = useRef(null);
  ClickOutside(loginHoverContentRef, () => {
    setShowLoginHover(false);
  });

  const signInLinks = _.get(navbarData, "signInLinksCollection.items");
  if (isLogin) {
    return (
      <li
        key={index}
        className={cn(
          styles.headerContainer,
          showLoginHover && title === "Sign in" ? styles.showHover : ""
        )}
      >
        {title === "Sign in" && signInLinks[2] && signInLinks[3] ? (
          <div
            className={cn(
              "button primary-outline-dropdown-button",
              styles.navigation,
              navStyles.startedButton
            )}
            ref={loginHoverContentRef}
          >
            <div>{title}</div>
            <div
              className={cn(
                styles.navigationContent,
                styles.navigationContentCenterSignIn
              )}
            >
              <NavLink
                dataRole={signInLinks[2].dataRole}
                dataCta={signInLinks[2].dataCta}
                href={signInLinks[2].slug}
                className={styles.linkContainerSignIn}
                external={signInLinks[2].external}
              >
                <div className={styles.imageContainer}>
                  <Image src={makeLogo} alt={`Make logo`} layout={"fill"} />
                </div>
                <div className={styles.textContainer}>
                  <header className={styles.signInTextMake}>
                    {signInLinks[2].name}
                  </header>
                  <span className={styles.linkDescription}>
                    {signInLinks[2].description}
                  </span>
                </div>
              </NavLink>
              <NavLink
                dataRole={signInLinks[3].dataRole}
                dataCta={signInLinks[3].dataCta}
                href={signInLinks[3].slug}
                className={styles.linkContainerSignIn}
                external={signInLinks[3].external}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={integromatLogo}
                    alt={`Integromat logo`}
                    layout={"fill"}
                  />
                </div>
                <div className={styles.textContainer}>
                  <header className={styles.signInTextIntegromat}>
                    {signInLinks[3].name}
                  </header>
                  <span className={styles.linkDescription}>
                    {signInLinks[3].description}
                  </span>
                </div>
              </NavLink>
            </div>
          </div>
        ) : loginSlug ? (
          <NavLink
            href={loginSlug}
            className={cn(
              "button gradient",
              styles.navigation,
              navStyles.startedButton
            )}
          >
            <div>{title}</div>
          </NavLink>
        ) : null}
      </li>
    );
  }
  return (
    <li
      key={index}
      className={cn("caption", navStyles.menuLink, styles.headerContainer)}
    >
      <div className={cn(styles.headerContainer, navStyles.menuLinkColors)}>
        {isHoverable ? (
          <div>{title}</div>
        ) : (
          <NavLink
            className={cn(styles.headerContainer, navStyles.menuLinkColors)}
            href={link.link.slug}
            dataCta={link.link.dataCta}
            dataRole={link.link.dataRole}
            external={link.link.external}
          >
            {title}
          </NavLink>
        )}
        {isHoverable ? (
          <IoChevronDownSharp className={styles.activeIcon} />
        ) : null}
      </div>
      {isHoverable ? (
        <divs
          className={cn(
            styles.navigationContent,
            styles.navigationContentCenter
          )}
        >
          {link.megaMenuColumnsCollection.items[0].columnLinksCollection.items.map(
            (link, index) => {
              return (
                <NavLink
                  key={index}
                  dataRole={link.dataRole}
                  dataCta={link.dataCta}
                  href={link.slug}
                  className={styles.linkContainer}
                  external={link.external}
                >
                  {renderIcon(link.name, styles.icons)}
                  <div className={styles.textContainer}>
                    <header>{link.name}</header>
                    <span className={cn(styles.linkDescription)}>
                      {link.description}
                    </span>
                  </div>
                </NavLink>
              );
            }
          )}
        </divs>
      ) : null}
    </li>
  );
};

Dropdown.propTypes = propTypes;

export default Dropdown;
