import styles from "./TemplatesSearchSimilar.module.scss";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import ReactMarkdown from "react-markdown";
import _ from "lodash";

import { Input } from "@components/common";
import { TemplateCard, MissingResultsCard } from "@components/shared";
import searchFilter from "@utils/searchFilter";
import replaceDetailsWildCard from "@utils/replaceDetailsWildCard";
import replaceRangeWildCard from "@utils/replaceRangeWildCard";

const propTypes = {
  name: PropTypes.string.isRequired,
  name2: PropTypes.string,
  name3: PropTypes.string,
  search: PropTypes.bool,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      name: PropTypes.string.isRequired,
    })
  ),
  appDetails: PropTypes.shape({
    templateTitle: PropTypes.string,
    similarTitle: PropTypes.string,
    templateDescription: PropTypes.string,
    templatePlaceholder: PropTypes.string,
  }),
  total: PropTypes.number.isRequired,
};

// Component for the TemplatesSearchSimilar inside of the AppDetails Page
const TemplatesSearchSimilar = ({
  name,
  name2,
  name3,
  templates,
  appDetails,
  search,
  total,
}) => {
  // changes the amount of items per page based on mobile or desktop rendering
  const itemsPerPage = isMobile ? 4 : 9;
  const { register, watch, handleSubmit } = useForm();
  const [filteredResults, setFilteredResults] = useState(templates);
  const [numberOfResults, setNumberOfResults] = useState(itemsPerPage);
  const nameArray = [name, name2, name3];

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
    if (search) {
      searchFilter(
        templates,
        watch("templatesSearch"),
        filteredResults,
        setFilteredResults,
        jumpToFirstPage
      );
    }
  }, [watch("templatesSearch")]);

  // .map that renders the search results from the search input
  const renderSearchResults =
    filteredResults instanceof Array &&
    filteredResults.slice(0, numberOfResults).map((template, index) => {
      return (
        <div key={index} className={styles.templateWrapper}>
          <TemplateCard template={template} />
        </div>
      );
    });

  // .map that renders top 20 priority items if no results
  const renderSuggestedItems =
    templates instanceof Array &&
    templates.slice(0, 24).map((item, index) => (
      <div className={styles.templateWrapper} key={index}>
        <TemplateCard template={item} />
      </div>
    ));

  // Function to load more results
  const loadMoreHandler = () => {
    setNumberOfResults(numberOfResults + itemsPerPage);
  };

  // Function that resets number of results to the initial number
  const loadLessHandler = () => {
    setNumberOfResults(itemsPerPage);
  };

  const onSubmit = (data, event) => {
    event.preventDefault();
  };

  return (
    <div className={cn("container", styles.templates, search && styles.search)}>
      <div className={styles.headerContainer}>
        <h2 className={styles.templateTitle}>
          {replaceRangeWildCard(
            replaceDetailsWildCard(
              appDetails?.templateTitle || appDetails?.similarTitle,
              nameArray
            ),
            total
          )}
        </h2>
        <div className="body-large">
          <ReactMarkdown>
            {replaceRangeWildCard(
              replaceDetailsWildCard(
                appDetails?.templateDescription,
                nameArray
              ),
              total
            )}
          </ReactMarkdown>
        </div>
      </div>
      <div className={styles.searchContainer}>
        {search && (
          <form
            name="templateSearch"
            className={styles.searchForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              className={styles.searchInput}
              name="templatesSearch"
              type="text"
              placeholder={replaceRangeWildCard(
                replaceDetailsWildCard(
                  appDetails?.templatePlaceholder,
                  nameArray
                ),
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
        )}
        <div className={styles.resultsWrapper}>
          <div className={styles.searchResults}>
            {filteredResults.length === 0 ? (
              <MissingResultsCard
                missingSearchResultsTitle={missingSearchResultsTitle}
                missingSearchResultsDescription={
                  missingSearchResultsDescription
                }
                productType={"Templates"}
              >
                {renderSuggestedItems}
              </MissingResultsCard>
            ) : (
              renderSearchResults
            )}
          </div>
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

TemplatesSearchSimilar.propTypes = propTypes;

export default TemplatesSearchSimilar;
