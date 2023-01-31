import styles from "./Layout.module.scss";
import { throttle } from "lodash";
import { useState, useEffect, useRef } from "react";
import cn from "classnames";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import _ from "lodash";

import { Footer, SimpleFooter, NavHeader } from "@components/common";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
// import HeroAnimationScripts from "./HeroAnimationScripts";
import "@reach/skip-nav/styles.css";

const propTypes = {
  children: PropTypes.element.isRequired,
  pageProps: PropTypes.shape({
    navbarData: PropTypes.object.isRequired,
    footerData: PropTypes.object.isRequired,
  }),
};

const Layout = ({ children, pageProps }) => {
  const { navbarData, footerData, darkNav } = pageProps;
  const { setValue } = useFormContext();
  const router = useRouter();

  useEffect(() => {
    const query = router.query;
    const utmValues = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
    ];
    _.forEach(utmValues, (value) => {
      if (query[value]) {
        setValue(value, query[value], { shouldTouch: true });
      }
    });
  }, [router.query]);
  // http://localhost:3000/en/contact-us?utm_source=odwtest1&utm_medium=odwtest2&utm_campaign=odwtest3&utm_content=odwtest4&utm_term=odwtest5&gclid=odwtest6

  // siteInteract is a useful piece of state (TODO: split out into context)
  // that waits for either a click or a scroll of the website before rendering
  // whatever unoptimized images or scripts is associated with it.
  // for now this is a quick solution for handling the very unoptimized product hunt.
  const [siteInteract, setSiteInteract] = useState(false);
  const siteInteractRef = useRef();
  useEffect(() => {
    siteInteractRef.current = siteInteract;
  }, [siteInteract]);

  // Logic and useEffect to move the Product Hunt out of the way of the social Media icons in the footer
  const footerRef = useRef();
  const [productHuntMove, setProductHuntMove] = useState(false);
  const productHuntMoveRef = useRef();
  useEffect(() => {
    productHuntMoveRef.current = productHuntMove;
  }, [productHuntMove]);

  // useEffect that controlls the scroll listener for the product hunt move
  useEffect(() => {
    window.addEventListener("scroll", interactOnScroll);
    return () => {
      window.removeEventListener("scroll", interactOnScroll);
    };
  }, []);

  // stops certain scripts from running until a user interacts with something on the site
  // having the scripts load immediately was causing delays
  const interactOnScroll = throttle(() => {
    if (!siteInteractRef.current) {
      setSiteInteract(true);
    }
    if (
      footerRef.current &&
      process.env.NEXT_PUBLIC_PRODUCT_HUNT &&
      process.env.NEXT_PUBLIC_PRODUCT_HUNT !== "false"
    ) {
      const footerTop = footerRef.current.getBoundingClientRect().top;
      if (footerTop - window.innerHeight < 0) {
        if (!productHuntMoveRef.current) {
          setProductHuntMove(true);
        }
      } else {
        if (productHuntMoveRef.current) {
          setProductHuntMove(false);
        }
      }
    }
  }, 200);

  // Layout component to manage styling for the app.
  // SkipNav and SkipNavContent in place for accessability purposes
  // contains the Header and Footer to only render in one place
  return (
    <div
      className={styles.layout}
      role="none"
      onClick={() => !siteInteract && setSiteInteract(true)}
    >
      {/*<canvas id="hero-bg"></canvas>
      <HeroAnimationScripts />*/}
      <div className="hero-bg " />
      <SkipNavLink className={styles.skipNavLink} />
      <NavHeader navbarData={navbarData} darkNav={darkNav} />
      <SkipNavContent />
      {siteInteract &&
      process.env.NEXT_PUBLIC_PRODUCT_HUNT &&
      process.env.NEXT_PUBLIC_PRODUCT_HUNT !== "false" ? (
        <div
          className={cn(
            styles.producthunt,
            productHuntMove ? styles.producthuntMove : ""
          )}
        >
          <div>
            <a
              href="https://www.producthunt.com/posts/make-1?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-make-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=333087&theme=light&period=daily"
                alt="Make - Design, build and automate your work | Product Hunt"
                height={54}
                width={250}
                quality={90}
              />
            </a>
          </div>
        </div>
      ) : null}
      <main>{children}</main>
      {footerData && footerData.footerType === "simple" ? (
        <SimpleFooter footerData={footerData} footerRef={footerRef} />
      ) : (
        <Footer footerData={footerData} footerRef={footerRef} />
      )}
    </div>
  );
};

Layout.propTypes = propTypes;

export default Layout;
