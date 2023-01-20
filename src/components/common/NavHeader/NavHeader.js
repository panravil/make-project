import styles from "./NavHeader.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useRouter } from "next/router";
import { setCookie, getCookie } from "cookies-next";

import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
import { Link, BasicLink, Modal } from "@components/common";
import { DropdownHeader } from "@components/common/Dropdown";
import { LayoutModal } from "@components/shared";

const propTypes = {
  navbarData: PropTypes.shape({
    bannerText: PropTypes.string.isRequired,
    logo: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    logoLink: PropTypes.object.isRequired,
    menuLinksCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          link: PropTypes.object.isRequired,
          megaMenuColumnsCollection: PropTypes.object,
        })
      ).isRequired,
    }).isRequired,
    signInLinks: PropTypes.array,
    signInLinksCollection: PropTypes.shape({
      items: PropTypes.array,
    }),
    showMegaMenu: PropTypes.bool,
    showModal: PropTypes.bool,
    modalHeading: PropTypes.string,
    modalImage: PropTypes.object,
    modalText: PropTypes.string,
    modalLink: PropTypes.object,
  }),
  darkNav: PropTypes.bool,
};

// Header content and Menu content
const NavHeader = ({ navbarData, darkNav }) => {
  const router = useRouter();

  const logoLink = _.get(navbarData, "logoLink");
  const menuLinks = _.get(navbarData, "menuLinksCollection.items");
  const links = menuLinks.map((link) => {
    return link.link;
  });
  const logo = _.get(navbarData, "logo");
  const signUpLinks = _.get(navbarData, "signInLinks")
    ? _.get(navbarData, "signInLinks").map((link) => {
        return link.fields;
      })
    : _.get(navbarData, "signInLinksCollection.items");
  const isBrowser = typeof window !== "undefined";
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [navbarOpacity, setNavbarOpacity] = useState(0);
  const [headerAddClass, setHeaderAddClass] = useState("headerNoBanner");
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [showLoginHover, setShowLoginHover] = useState(false);

  useEffect(() => {
    if (!navbarData.showBanner) {
      setHeaderAddClass("headerNoBanner");
    } else {
      setHeaderAddClass(null);
    }
  }, [navbarData.showBanner]);

  useEffect(() => {
    const isCookie = getCookie("fromImtBannerDisplayed");

    if (
      !isCookie &&
      typeof router.query["fromImt"] !== "undefined" &&
      navbarData.showModal
    ) {
      setShowLayoutModal(true);
      setCookie("fromImtBannerDisplayed", "1");
    }
  }, [router.query]);

  // scroll position to adjust opacity of the navbar
  useScrollPosition(
    ({ currPos }) => {
      if (currPos.y <= 0) {
        if (navbarOpacity !== 0) {
          setNavbarOpacity(0);
        }
      } else {
        if (navbarOpacity !== 1) {
          setNavbarOpacity(1);
        }
      }
    },
    [isBrowser, navbarOpacity], // deps
    false, // element
    true, // useWindow
    100 // wait
  );

  return (
    <>
      <section className={darkNav ? "dark-background" : ""}>
        {navbarData.showBanner ? (
          <div
            className={cn(
              styles.banner,
              darkNav ? styles.darkNav : "",
              darkNav && navbarOpacity <= 0 ? styles.transparentNavBar : "",
              navbarOpen ? styles.navbarOpen : ""
            )}
          >
            {navbarData.bannerText}
          </div>
        ) : null}
        <header
          className={cn(
            styles.header,
            styles.headerHeight,
            styles[headerAddClass],
            darkNav ? styles.darkNav : "",
            darkNav && navbarOpacity <= 0 ? styles.transparentNavBar : "",
            navbarOpen ? styles.navbarOpen : ""
          )}
        >
          <Link
            link={logoLink}
            onClick={() => setNavbarOpen(false)}
            className={styles.logoLink}
          >
            <div>
              <Image
                src={logo.url}
                alt={logo.title}
                layout="responsive"
                sizes="12rem"
                width={130}
                height={(logo.height * 130) / logo.width}
                quality={90}
                priority={true}
              />
            </div>
          </Link>
          <NavDesktop navbarData={navbarData} darkNav={darkNav} />
          <div className={styles.buttonContainer}>
            {signUpLinks[0] ? (
              <DropdownHeader
                navbarData={navbarData}
                title={signUpLinks[0].name}
                loginSlug={signUpLinks[0].slug}
                isLogin={true}
                showLoginHover={showLoginHover}
                setShowLoginHover={setShowLoginHover}
                external={signUpLinks[0].external}
              />
            ) : null}
            {signUpLinks[1] ? (
              <BasicLink
                link={signUpLinks[1]}
                className={cn("button gradient", styles.startedButton)}
              />
            ) : null}
          </div>
          <NavMobile
            links={menuLinks}
            signUpLinks={signUpLinks}
            navbarOpen={navbarOpen}
            setNavbarOpen={setNavbarOpen}
            navbarOpacity={navbarOpacity}
            darkNav={darkNav}
          />
        </header>
        <div className={cn(styles.headerHeight, styles[headerAddClass])} />
      </section>
      {showLayoutModal ? (
        <Modal
          showModal={showLayoutModal}
          setShowModal={setShowLayoutModal}
          noPadding={true}
          restrictClose
          offsetTop
          extraClass={"layoutModal"}
        >
          <LayoutModal
            showModal={showLayoutModal}
            setShowModal={setShowLayoutModal}
            setShowLoginHover={setShowLoginHover}
            heading={navbarData.modalHeading}
            image={navbarData.modalImage}
            text={navbarData.modalText}
            link={navbarData.modalLink}
          />
        </Modal>
      ) : null}
    </>
  );
};

NavHeader.propTypes = propTypes;

export default NavHeader;
