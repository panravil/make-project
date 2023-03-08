import styles from "./DetailsHeader.module.scss";
import { useState, useRef, useEffect } from "react";
import cn from "classnames";
import _ from "lodash";
import { Link, BasicLink } from "@components/common";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { ShareDrawer } from "@components/common";
import { AppCard, TemplateIcon } from "@components/shared";
import SelectArrow from "@icons/SelectArrow";
import replaceDetailsWildCard from "@utils/replaceDetailsWildCard";
import replaceRangeWildCard from "@utils/replaceRangeWildCard";
import getWindowWidth from "@utils/getWindowWidth";

const propTypes = {
  template: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    usage: PropTypes.number.isRequired,
    appsCollection: PropTypes.shape({
      items: PropTypes.array,
    }).isRequired,
    categoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    subcategoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ),
    }).isRequired,
  }).isRequired,
  templateDetails: PropTypes.shape({
    backLink: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    description: PropTypes.string.isRequired,
    cta: PropTypes.object,
  }),
  total: PropTypes.number.isRequired,
};

// Header for the Template Details page
const TemplateDetailsHeader = ({ template, templateDetails, total }) => {
  const [truncate, setTruncate] = useState(true);
  const [toggleVisible, setToggleVisible] = useState(false);
  const descriptionElem = useRef(null);

  // Render a list of apps styled with the AppCard component
  const appsIncludedArray = _.get(template, "appsCollection.items") || [];
  const renderAppsIncluded = appsIncludedArray.map((app, index) => {
    return <AppCard key={index} app={app} smallHorizontal />;
  });

  // Function to render the subcategories with styling
  const renderSubcategories = () => {
    const subcategoriesArray = _.get(template, "subcategoriesCollection.items");
    const categoriesArray = _.get(template, "categoriesCollection.items");
    const filteredCategoriesArray = categoriesArray.filter((category) => {
      return category.name !== "App Families";
    });

    // Function to render the categories with styling
    const renderCategoriesMap = (subcategory, index) => {
      return (
        <div key={index} className={cn("caption heading", styles.category)}>
          <div className={styles.placeholderImage} />
          {subcategory.name}
        </div>
      );
    };

    // Check if there are sub categories, if not render categories. if that is also empty, return 'No Categories'
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

  // Returns the buttons to be rendered and used in both desktop and mobile renderings
  const renderButtons = (
    <BasicLink
      link={templateDetails?.cta}
      href={replaceDetailsWildCard(templateDetails?.cta?.slug, template?.slug)}
    >
      <div className={cn("button gradient", styles.appTryButton)}>
        {replaceRangeWildCard(
          replaceDetailsWildCard(templateDetails?.cta?.name, template?.name),
          total
        )}
      </div>
    </BasicLink>
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

  const testString = replaceRangeWildCard(
    replaceDetailsWildCard(
      templateDetails?.description,
      template?.name,
      template?.description
    ),
    total
  )

  console.log('testString is ', testString, template.description);

  return (
    <div
      data-cy="TemplateDetailsHeader"
      className={cn("container", styles.appHeader)}
    >
      <div className={styles.companyNameContainer}>
        <div className={styles.appLogo}>
          <TemplateIcon
            apps={appsIncludedArray}
            dimensions={160}
            className={styles.templateIcon}
          />
        </div>
        <h1 className="h2">
          {replaceRangeWildCard(
            replaceDetailsWildCard(templateDetails?.title, template?.name),
            total
          )}
        </h1>
      </div>
      <div className={styles.appDetailsContainer}>
        <div className={styles.appDescription}>
          <div className={styles.headerRow}>
            <div className={cn("h4", styles.descriptionHeader)}>
              {replaceRangeWildCard(
                replaceDetailsWildCard(
                  templateDetails?.subtitle,
                  template?.name
                ),
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
              {
                "The [Google](http://localhost:3000/en) Sheets [module](http://localhost:3000/en) checks for matches between the sender’s email address and the list of client email addresses." +
                "If a match is found, the label `client_mailbox` is added to the email. More information [here](https://bit.ly/3X6QuwR)."
              }
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
          <div className={styles.appsIncludedWrapper}>
            <div className={cn("h4", styles.appsIncludedTitle)}>
              Apps Included
            </div>
            <div className={styles.appsContainer}>{renderAppsIncluded}</div>
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

TemplateDetailsHeader.propTypes = propTypes;

export default TemplateDetailsHeader;
