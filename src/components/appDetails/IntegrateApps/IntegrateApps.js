import styles from "./IntegrateApps.module.scss";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import ReactMarkdown from "react-markdown";
import { AppIcon, MissingResultsCard } from "@components/shared";
import { Link } from "@components/common";
import _ from "lodash";

import { Input } from "@components/common";
import { AppCard } from "@components/shared";

import searchFilter from "@utils/searchFilter";
import replaceDetailsWildCard from "@utils/replaceDetailsWildCard";
import replaceRangeWildCard from "@utils/replaceRangeWildCard";
import AddApp from "@icons/AddApp";
import IconConnection from "@icons/IconConnection";

const propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  app2: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }),
  apps: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired
  ).isRequired,
  appDetails: PropTypes.shape({
    searchTitle: PropTypes.string,
    searchDescription: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    searchLink: PropTypes.object.isRequired,
  }),
  total: PropTypes.number.isRequired,
};

const IntegrateApps = ({ app, app2, apps, appDetails, total }) => {
  // Determine what apps are accessable based on the App that is
  // currently populating the AppDetails Page
  const name = app?.name;
  const name2 = app2?.name;
  const slug = app?.slug;
  const slug2 = app2?.slug;
  const itemsPerPage = isMobile ? 8 : 27;
  const { register, watch, handleSubmit } = useForm();
  const [numberOfResults, setNumberOfResults] = useState(itemsPerPage);
  const [filteredResults, setFilteredResults] = useState(apps);
  const nameArray = [name, name2];

  const missingSearchResultsTitle = _.get(
    appDetails,
    "missingSearchResultsTitle"
  );
  const missingSearchResultsDescription = _.get(
    appDetails,
    "missingSearchResultsDescription"
  );

  // returns the user to the first page
  const jumpToFirstPage = () => {
    setNumberOfResults(itemsPerPage);
  };

  // useEffect to handle filtering the search results
  useEffect(() => {
    searchFilter(
      apps,
      watch("integrationAndActionsSearch"),
      filteredResults,
      setFilteredResults,
      jumpToFirstPage
    );
  }, [watch("integrationAndActionsSearch")]);

  // render the filtered results as individual cards
  const renderSearchResults =
    filteredResults instanceof Array &&
    filteredResults.slice(0, numberOfResults).map((appResult, index) => {
      return (
        <div data-cy="IntegrateApp" key={index} className={styles.appWrapper}>
          <AppCard
            small
            app={appResult}
            href={
              slug2
                ? `/integrations/${slug}/${slug2}/${appResult.slug}`
                : `/integrations/${slug}/${appResult.slug}`
            }
          />
        </div>
      );
    });

  // load more button increases the number of apps displayed
  const loadMoreHandler = () => {
    setNumberOfResults(numberOfResults + itemsPerPage);
  };

  // load less button returns it back to the initial amount of items
  const loadLessHandler = () => {
    setNumberOfResults(itemsPerPage);
  };

  const onSubmit = (data, event) => {
    event.preventDefault();
  };

  return (
    <div
      data-cy="IntegrateApps"
      className={cn("container", styles.integration)}
    >
      <div data-cy="IntegrateAppsHeader" className={styles.headerContainer}>
        <h2>
          {replaceRangeWildCard(
            replaceDetailsWildCard(appDetails?.searchTitle, nameArray),
            total
          )}
        </h2>
        <div className="body-large">
          <ReactMarkdown>
            {replaceRangeWildCard(
              replaceDetailsWildCard(appDetails?.searchDescription, nameArray),
              total
            )}
          </ReactMarkdown>
        </div>
      </div>
      <div className={styles.searchContainer}>
        <form
          data-cy="IntegrateAppsSearch"
          name="integrationsSearch"
          className={styles.searchForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            className={styles.searchInput}
            name="integrationAndActionsSearch"
            type="text"
            placeholder={replaceRangeWildCard(
              replaceDetailsWildCard(appDetails?.searchPlaceholder, nameArray),
              total
            )}
            register={register}
            validations={{
              required: false,
            }}
            search
            gradient
          />
        </form>
        <div
          data-cy="IntegrateAppsSchema"
          className={styles.integrateAppsImageContainer}
        >
          <div className={styles.appIconWrapper}>
            <AppIcon app={app} className={styles.appIcon} dimensions={200} />
          </div>
          <div className={styles.iconConnectionWrapper}>
            <IconConnection />
          </div>
          {app2 && (
            <>
              <div className={styles.appIconWrapper}>
                <AppIcon
                  app={app2}
                  className={styles.appIcon}
                  dimensions={200}
                />
              </div>
              <div className={styles.iconConnectionWrapper}>
                <IconConnection />
              </div>
            </>
          )}
          <div className={styles.addAppWrapper}>
            <AddApp />
          </div>
        </div>
        <div className={styles.resultsWrapper}>
          <div
            data-cy="IntegrateAppsSearchResult"
            className={styles.searchResultsSmall}
          >
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
          <div className={styles.ctaWrapper}>
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
            <hr />
            {_.get(appDetails, "searchLink.slug") ? (
              <Link
                link={appDetails.searchLink}
                href={_.get(appDetails, "searchLink.slug")}
                external={true}
              >
                <div className={cn("button gradient", styles.appTryButton)}>
                  {_.get(appDetails, "searchLink.name")}
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

IntegrateApps.propTypes = propTypes;

export default IntegrateApps;
