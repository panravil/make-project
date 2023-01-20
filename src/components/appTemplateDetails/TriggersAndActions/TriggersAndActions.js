import styles from "./TriggersAndActions.module.scss";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import searchFilter from "@utils/searchFilter";
import cn from "classnames";
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import { isMobile } from "react-device-detect";
import { AppIcon, MissingResultsCard, TemplateIcon } from "@components/shared";

import LightningBolt from "@icons/LightningBolt";

import { Dropdown } from "@components/common";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";
import replaceDetailsWildCard from "@utils/replaceDetailsWildCard";
import replaceRangeWildCard from "@utils/replaceRangeWildCard";

const propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string.isRequired,
    triggersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    actionsJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    aggregatorsJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    feedersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    transformersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    searchesJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
  }).isRequired,
  app2: PropTypes.shape({
    name: PropTypes.string.isRequired,
    triggersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    actionsJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    aggregatorsJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    feedersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    transformersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    searchesJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
  }),
  app3: PropTypes.shape({
    name: PropTypes.string.isRequired,
    triggersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    actionsJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    aggregatorsJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    feedersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    transformersJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
    searchesJson: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string,
        acid: PropTypes.bool,
        listener: PropTypes.bool,
      }).isRequired
    ),
  }),
  appDetails: PropTypes.shape({
    triggersTitle: PropTypes.string.isRequired,
    triggersDescription: PropTypes.string.isRequired,
  }),
  total: PropTypes.number.isRequired,
};

// Component for the triggers and actions section of the App Details page
const TriggersAndActions = ({ app, app2, app3, appDetails, total }) => {
  // function that takes object in an array, and adds a category as a key/value pair
  const addCategory = (array, category) => {
    return array?.map((option) => {
      return { ...option, category };
    });
  };
  // Create unique arrays for each trigger, action, etc. and adds the Key/Value of the action to the app objects
  const triggersArray = concatUniqueSortArrays([
    addCategory(_.get(app, "triggersJson"), "Trigger"),
    addCategory(_.get(app2, "triggersJson"), "Trigger"),
    addCategory(_.get(app3, "triggersJson"), "Trigger"),
  ]);
  const actionsArray = concatUniqueSortArrays([
    addCategory(_.get(app, "actionsJson"), "Action"),
    addCategory(_.get(app2, "actionsJson"), "Action"),
    addCategory(_.get(app3, "actionsJson"), "Action"),
  ]);
  const searchesArray = concatUniqueSortArrays([
    addCategory(_.get(app, "searchesJson"), "Search"),
    addCategory(_.get(app2, "searchesJson"), "Search"),
    addCategory(_.get(app3, "searchesJson"), "Search"),
  ]);
  const aggregatorsArray = concatUniqueSortArrays([
    addCategory(_.get(app, "aggregatorsJson"), "Aggregator"),
    addCategory(_.get(app2, "aggregatorsJson"), "Aggregator"),
    addCategory(_.get(app3, "aggregatorsJson"), "Aggregator"),
  ]);
  const feedersArray = concatUniqueSortArrays([
    addCategory(_.get(app, "feedersJson"), "Feeder"),
    addCategory(_.get(app2, "feedersJson"), "Feeder"),
    addCategory(_.get(app3, "feedersJson"), "Feeder"),
  ]);
  const transformersArray = concatUniqueSortArrays([
    addCategory(_.get(app, "transformersJson"), "Transformer"),
    addCategory(_.get(app2, "transformersJson"), "Transformer"),
    addCategory(_.get(app3, "transformersJson"), "Transformer"),
  ]);
  const appAllTriggersArray = concatUniqueSortArrays([
    addCategory(_.get(app, "triggersJson"), "Trigger"),
    addCategory(_.get(app, "actionsJson"), "Action"),
    addCategory(_.get(app, "aggregatorsJson"), "Aggregator"),
    addCategory(_.get(app, "feedersJson"), "Feeder"),
    addCategory(_.get(app, "transformersJson"), "Transformer"),
    addCategory(_.get(app, "searchesJson"), "Search"),
  ]);
  const app2AllTriggersArray = concatUniqueSortArrays([
    addCategory(_.get(app2, "triggersJson"), "Trigger"),
    addCategory(_.get(app2, "actionsJson"), "Action"),
    addCategory(_.get(app2, "aggregatorsJson"), "Aggregator"),
    addCategory(_.get(app2, "feedersJson"), "Feeder"),
    addCategory(_.get(app2, "transformersJson"), "Transformer"),
    addCategory(_.get(app2, "searchesJson"), "Search"),
  ]);
  const app3AllTriggersArray = concatUniqueSortArrays([
    addCategory(_.get(app3, "triggersJson"), "Trigger"),
    addCategory(_.get(app3, "actionsJson"), "Action"),
    addCategory(_.get(app3, "aggregatorsJson"), "Aggregator"),
    addCategory(_.get(app3, "feedersJson"), "Feeder"),
    addCategory(_.get(app3, "transformersJson"), "Transformer"),
    addCategory(_.get(app3, "searchesJson"), "Search"),
  ]);
  const allActionsArray = concatUniqueSortArrays([
    appAllTriggersArray,
    app2AllTriggersArray,
    app3AllTriggersArray,
  ]);

  const itemsPerPage = isMobile ? 4 : 9;
  const { watch, setValue, handleSubmit, control } = useForm();
  const [categorySelected, setCategorySelected] = useState(allActionsArray);
  const [filteredResults, setFilteredResults] = useState(allActionsArray);
  const [numberOfResults, setNumberOfResults] = useState(itemsPerPage);
  const nameArray = [app?.name, app2?.name, app3?.name];

  const allModulesTitle = `All Modules (${allActionsArray.length})`;
  const triggersTitle = `Triggers (${triggersArray.length})`;
  const actionsTitle = `Actions (${actionsArray.length})`;
  const searchesTitle = `Search (${searchesArray.length})`;
  const transformersTitle = `Transformer (${transformersArray.length})`;
  const aggregatorsTitle = `Aggregator (${aggregatorsArray.length})`;
  const feedersTitle = `Feeder (${feedersArray.length})`;
  // Options for the current Dropdown Menu
  const dropdownOptionsArray = _.compact([
    allModulesTitle,
    triggersArray.length > 0 ? triggersTitle : null,
    actionsArray.length > 0 ? actionsTitle : null,
    searchesArray.length > 0 ? searchesTitle : null,
    transformersArray.length > 0 ? transformersTitle : null,
    aggregatorsArray.length > 0 ? aggregatorsTitle : null,
    feedersArray.length > 0 ? feedersTitle : null,
  ]);

  const [lastCategorySelected, setLastCategorySelected] =
    useState(allModulesTitle);

  // returns the user to the first page
  const jumpToFirstPage = () => {
    setNumberOfResults(itemsPerPage);
  };

  // useEffect to see change the type of category the user
  // is searching
  useEffect(() => {
    const currentCategory = watch("triggerAndActionSearch");
    if (lastCategorySelected === currentCategory) {
      return;
    }
    setLastCategorySelected(currentCategory);
    switch (currentCategory) {
      case allModulesTitle:
        setCategorySelected(allActionsArray);
        break;
      case triggersTitle:
        setCategorySelected(triggersArray);
        break;
      case actionsTitle:
        setCategorySelected(actionsArray);
        break;
      case searchesTitle:
        setCategorySelected(searchesArray);
        break;
      case aggregatorsTitle:
        setCategorySelected(aggregatorsArray);
        break;
      case feedersTitle:
        setCategorySelected(feedersArray);
        break;
      case transformersTitle:
        setCategorySelected(transformersArray);
        break;
      default:
        setCategorySelected(allActionsArray);
        break;
    }
  }, [watch("triggerAndActionSearch")]);

  // useEffect to handle filtering the search results
  useEffect(() => {
    searchFilter(
      categorySelected,
      "",
      filteredResults,
      setFilteredResults,
      jumpToFirstPage
    );
  }, [watch("triggerAndActionSearch"), categorySelected]);

  // TODO: PROBABLY OVERKILL BUT POSSIBLE TO SHOW TRIGGERS & ACTIONS FROM ALL COMBINATIONS
  const renderIcon = (result) => {
    if (
      // If the result is not included in any of the apps' triggers, actions, etc.
      !appAllTriggersArray.some((item) => {
        return item.description === result.description;
      }) &&
      !app2AllTriggersArray.some((item) => {
        return item.description === result.description;
      }) &&
      !app3AllTriggersArray.some((item) => {
        return item.description === result.description;
      })
    ) {
      return null;
    } else if (
      // If the result is included in only the first app's triggers, actions, etc.
      !app2AllTriggersArray.some((item) => {
        return item.description === result.description;
      }) &&
      !app3AllTriggersArray.some((item) => {
        return item.description === result.description;
      })
    ) {
      return <AppIcon app={app} className={styles.appIcon} />;
    } else if (
      // If the result is included in only the second app's triggers, actions, etc.
      !appAllTriggersArray.some((item) => {
        return item.description === result.description;
      }) &&
      !app3AllTriggersArray.some((item) => {
        return item.description === result.description;
      })
    ) {
      return <AppIcon app={app2} className={styles.appIcon} />;
    } else if (
      // If the result is included in only the third app's triggers, actions, etc.
      !appAllTriggersArray.some((item) => {
        return item.description === result.description;
      }) &&
      !app2AllTriggersArray.some((item) => {
        return item.description === result.description;
      })
    ) {
      return <AppIcon app={app3} className={styles.appIcon} />;
    } else if (
      // If the result is included in only the first and second apps' triggers, actions, etc.
      !app3AllTriggersArray.some((item) => {
        return item.description === result.description;
      })
    ) {
      return (
        <TemplateIcon
          apps={_.compact([app, app2])}
          className={styles.templateIcon}
        />
      );
    } else if (
      // If the result is included in only the first and third apps' triggers, actions, etc.
      !app2AllTriggersArray.some((item) => {
        return item.description === result.description;
      })
    ) {
      return (
        <TemplateIcon
          apps={_.compact([app, app3])}
          className={styles.templateIcon}
        />
      );
    } else if (
      // If the result is included in only the second and third apps' triggers, actions, etc.
      !appAllTriggersArray.some((item) => {
        return item.description === result.description;
      })
    ) {
      return (
        <TemplateIcon
          apps={_.compact([app2, app3])}
          className={styles.templateIcon}
        />
      );
    } else if (
      // If the result is included in the first, second, and third apps' triggers, actions, etc.
      appAllTriggersArray.some((item) => {
        return item.description === result.description;
      }) &&
      app2AllTriggersArray.some((item) => {
        return item.description === result.description;
      }) &&
      app3AllTriggersArray.some((item) => {
        return item.description === result.description;
      })
    ) {
      return (
        <TemplateIcon
          apps={_.compact([app, app2, app3])}
          className={styles.templateIcon}
        />
      );
    }
  };

  const missingSearchResultsTitle = _.get(
    appDetails,
    "missingSearchResultsTitle"
  );
  const missingSearchResultsDescription = _.get(
    appDetails,
    "missingSearchResultsDescription"
  );

  // Returns array of styled results to render on the page
  const renderSearchResults =
    filteredResults instanceof Array &&
    filteredResults.slice(0, numberOfResults).map((result, index) => {
      return (
        <div
          data-cy="TriggersAndActions__item"
          key={index}
          className={cn(styles.triggerWrapper, "card-background")}
        >
          <div className={styles.searchResultIcon}>{renderIcon(result)}</div>
          <div className={/*styles.contentWrapper*/ styles.searchResultText}>
            <div className={cn("heading", styles.heading)}>{result?.name}</div>
            <p className={cn("caption", styles.description)}>
              {result?.description}
            </p>
            <div className={cn("small", styles.integrationType)}>
              <div className={styles.integrationIcon}>
                <LightningBolt />
              </div>
              <div>
                {result.category}
                {result.listener && <small>, Instant</small>}
                {result.acid && <small>, Acid</small>}
              </div>
            </div>
          </div>
        </div>
      );
    });

  // Function for loading more results
  const loadMoreHandler = () => {
    setNumberOfResults(filteredResults.length);
  };

  // Function for setting number of results back ot initial number
  const loadLessHandler = () => {
    setNumberOfResults(itemsPerPage);
  };

  const onSubmit = (data, event) => {
    event.preventDefault();
  };

  return (
    <div
      data-cy="TriggersAndActions"
      className={cn("container", styles.triggersAndActions)}
    >
      <div className={styles.headerContainer}>
        <h2>
          {replaceRangeWildCard(
            replaceDetailsWildCard(appDetails?.triggersTitle, nameArray),
            total
          )}
        </h2>
        <div className="body-large">
          <ReactMarkdown>
            {replaceRangeWildCard(
              replaceDetailsWildCard(
                appDetails?.triggersDescription,
                nameArray
              ),
              total
            )}
          </ReactMarkdown>
        </div>
      </div>
      <div className={styles.searchContainer}>
        <form
          /*name="triggerAndActionSearch"*/
          className={styles.searchForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Dropdown
            name={"triggerAndActionSearch"}
            control={control}
            setValue={setValue}
            optionsArray={dropdownOptionsArray}
            defaultValue={dropdownOptionsArray[0]}
            containerClassName={styles.searchInput}
            gradient
          />
        </form>
        <div className={styles.resultsWrapper}>
          {categorySelected ? (
            <div className={styles.searchResults}>
              {filteredResults.length === 0 ? (
                <MissingResultsCard
                  missingSearchResultsTitle={missingSearchResultsTitle}
                  missingSearchResultsDescription={
                    missingSearchResultsDescription
                  }
                />
              ) : (
                renderSearchResults
              )}
            </div>
          ) : null}
          {filteredResults?.length > numberOfResults ? (
            <button
              className={cn("primary-outline", styles.loadMore)}
              onClick={loadMoreHandler}
            >
              Load More
            </button>
          ) : null}
          {numberOfResults > itemsPerPage ? (
            <button
              className={cn(
                "primary-outline",
                styles.loadMore,
                styles.loadLess
              )}
              onClick={loadLessHandler}
            >
              Collapse
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

TriggersAndActions.propTypes = propTypes;

export default TriggersAndActions;
