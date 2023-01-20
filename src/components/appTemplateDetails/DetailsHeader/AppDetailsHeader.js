import styles from "./DetailsHeader.module.scss";
import { useState, useRef, useEffect } from "react";
import cn from "classnames";
import { Link, BasicLink } from "@components/common";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import _ from "lodash";

import { ShareDrawer } from "@components/common";
import { AppIcon, TemplateIcon } from "@components/shared";
import SelectArrow from "@icons/SelectArrow";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";
import replaceDetailsWildCard from "@utils/replaceDetailsWildCard";
import replaceRangeWildCard from "@utils/replaceRangeWildCard";
import getWindowWidth from "@utils/getWindowWidth";

const propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string.isRequired,
    categoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
    subcategoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
  }).isRequired,
  app2: PropTypes.shape({
    name: PropTypes.string.isRequired,
    categoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
    subcategoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
  }),
  app3: PropTypes.shape({
    name: PropTypes.string.isRequired,
    categoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
    subcategoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
  }),
  appDetails: PropTypes.shape({
    backLink: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cta: PropTypes.object.isRequired,
    cta2: PropTypes.object.isRequired,
    ctaLink: PropTypes.object.isRequired,
  }),
  total: PropTypes.number.isRequired,
};

// Header component for the App Page
const AppDetailsHeader = ({ app, app2, app3, appDetails, total }) => {
  const nameArray = [app?.name, app2?.name, app3?.name];
  const [truncate, setTruncate] = useState(true);
  const [toggleVisible, setToggleVisible] = useState(false);
  const descriptionElem = useRef(null);
  const [isEnterprise, setIsEnterprise] = useState(false);

  // Create an array of unique subcategoties
  const renderSubcategories = () => {
    const subcategoriesArray = concatUniqueSortArrays([
      _.get(app, "subcategoriesCollection.items"),
      _.get(app2, "subcategoriesCollection.items"),
      _.get(app3, "subcategoriesCollection.items"),
    ]);

    // Create an array of unique categoties
    const categoriesArray = concatUniqueSortArrays([
      _.get(app, "categoriesCollection.items"),
      _.get(app2, "categoriesCollection.items"),
      _.get(app3, "categoriesCollection.items"),
    ]);
    // Remove 'App Families' from the array
    const filteredCategoriesArray = categoriesArray.filter((category) => {
      return category.name !== "App Families";
    });

    // Render the categories with styling
    const renderCategoriesMap = (subcategory, index) => {
      return (
        <div key={index} className={cn("caption heading", styles.category)}>
          <div className={styles.placeholderImage} />
          {subcategory.name}
        </div>
      );
    };

    // Check if there are sub categories, if not render categories, if that is also empty return 'No Categories"
    if (subcategoriesArray.length > 0) {
      return subcategoriesArray.map(renderCategoriesMap).slice(0, 4);
    } else if (filteredCategoriesArray.length > 0) {
      return filteredCategoriesArray.map(renderCategoriesMap).slice(0, 4);
    } else {
      return <div>No Categories</div>;
    }
  };

  // Toggle truncate on text
  const handleTruncateArrow = () => {
    setTruncate(!truncate);
  };

  // Rendering of the buttons to be used in either the mobile or desktop view
  // TODO: REVIEW CONSEQUENCES TO CTA 2 VS CTA FOR 3 APP INTEGRATIONS
  const ctaButton = app2 ? appDetails?.cta2 : appDetails?.cta;
  const renderButtons = (
    <>
      {!isEnterprise ? (
        <BasicLink
          link={ctaButton}
          href={replaceDetailsWildCard(ctaButton?.slug, app?.slug)}
        >
          <div className={cn("button gradient", styles.appTryButton)}>
            {replaceRangeWildCard(
              replaceDetailsWildCard(ctaButton?.name, nameArray),
              total
            )}
          </div>
        </BasicLink>
      ) : (
        <BasicLink
          link={ctaButton}
          href={"/en/contact-us?help=Talk%20to%20Sales"}
          dataRole="Enterprise"
        >
          <div className={cn("button gradient", styles.appTryButton)}>
            Talk to sales
          </div>
        </BasicLink>
      )}

      <BasicLink
        className="bold"
        link={appDetails?.ctaLink}
        href={
          !app2
            ? `https://www.make.com/en/help/app/${app.slug}`
            : replaceDetailsWildCard(appDetails?.ctaLink?.slug, app?.slug)
        }
      >
        <div className={styles.buttonCaption}>
          {!app2
            ? replaceRangeWildCard(
                replaceDetailsWildCard(appDetails?.ctaLink?.name, nameArray),
                total
              )
            : "Browse our documentation"}
        </div>
      </BasicLink>
    </>
  );

  const windowWidth = getWindowWidth();

  useEffect(() => {
    if (descriptionElem && descriptionElem.current) {
      const element = descriptionElem.current;
      if (
        element.offsetHeight < element.scrollHeight ||
        element.offsetWidth < element.scrollWidth
      ) {
        setToggleVisible(true);
      } else {
        setToggleVisible(false);
      }
    }
  }, [windowWidth]);

  useEffect(() => {
    const isAppEnterprise = app?.categoriesCollection.items.filter((item) => {
      return item.slug === `enterprise`;
    });
    const isApp2Enterprise = app2?.categoriesCollection.items.filter((item) => {
      return item.slug === `enterprise`;
    });
    const isApp3Enterprise = app3?.categoriesCollection.items.filter((item) => {
      return item.slug === `enterprise`;
    });
    if (
      (app && !app2 && !app3 && isAppEnterprise?.length) ||
      (app &&
        app2 &&
        !app3 &&
        isAppEnterprise?.length &&
        isApp2Enterprise?.length) ||
      (app &&
        app2 &&
        app3 &&
        isAppEnterprise?.length &&
        isApp2Enterprise?.length &&
        isApp3Enterprise?.length)
    ) {
      setIsEnterprise(true);
    } else {
      setIsEnterprise(false);
    }
  }, []);

  return (
    <div data-cy="DetailsHeader" className={cn("container", styles.appHeader)}>
      <div className={styles.companyNameContainer}>
        <div className={styles.appLogo}>
          {app2 ? (
            <TemplateIcon
              apps={_.compact([app, app2, app3])}
              dimensions={160}
              className={styles.templateIcon}
            />
          ) : (
            <AppIcon app={app} className={styles.appIcon} dimensions={80} />
          )}
        </div>
        <h1 className="h2">
          {replaceRangeWildCard(
            replaceDetailsWildCard(appDetails?.title, nameArray),
            total
          )}
        </h1>
      </div>
      <div className={styles.appDetailsContainer}>
        <div className={styles.appDescription}>
          <div className={styles.aboutShareWrapper}>
            <div className="h4">
              {replaceRangeWildCard(
                replaceDetailsWildCard(appDetails?.subtitle, nameArray),
                total
              )}
            </div>
            <div className={styles.shareDrawerWrapper}>
              <ShareDrawer />
            </div>
          </div>
          <div
            ref={descriptionElem}
            className={cn(
              "body-large",
              styles.bodyText,
              truncate ? styles.truncated : ""
            )}
          >
            <ReactMarkdown>
              {replaceRangeWildCard(
                replaceDetailsWildCard(appDetails?.description, nameArray),
                total
              )}
            </ReactMarkdown>
          </div>
          <div
            className={cn(
              styles.truncateArrow,
              truncate ? styles.truncated : "",
              toggleVisible ? styles.showToggle : styles.hideToggle
            )}
            onClick={handleTruncateArrow}
            onKeyPress={handleTruncateArrow}
            role="button"
            tabIndex={0}
          >
            <SelectArrow />
          </div>
          <div className={cn(styles.buttonContainer, styles.desktop)}>
            {renderButtons}
          </div>
        </div>
        <div className={styles.categoriesWrapper}>
          <div className={cn("b", styles.categoriesTitle)}>Categories</div>
          {renderSubcategories()}
        </div>
      </div>
      <div className={cn(styles.buttonContainer, styles.mobile)}>
        {renderButtons}
      </div>
    </div>
  );
};

AppDetailsHeader.propTypes = propTypes;

export default AppDetailsHeader;
