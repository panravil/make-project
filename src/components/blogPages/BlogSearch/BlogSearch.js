import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./BlogSearch.module.scss";
import { Dropdown, Input } from "@components/common";
import { useForm } from "react-hook-form";
import cn from "classnames";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";
import _ from "lodash";
import searchFilter from "@utils/searchFilter";
import { BlogCard } from "@components/shared";
import { MissingResultsCard } from "@components/shared";
import { WebinarCard } from "@components/shared";

const propTypes = {
  blogIndexData: PropTypes.shape({
    searchTitle: PropTypes.string.isRequired,
    missingSearchResultsTitle: PropTypes.string.isRequired,
    missingSearchResultsDescription: PropTypes.string.isRequired,
  }).isRequired,
  allBlogs: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
  useCase: PropTypes.bool,
  webinar: PropTypes.bool,
  preselectedCategory: PropTypes.object,
};

// Blog Search for the blog index page
const BlogSearch = ({
  blogIndexData,
  allBlogs,
  categories,
  topics,
  useCase,
  webinar,
  preselectedCategory,
}) => {
  const itemsPerPage = isMobile ? 4 : 9;
  const { register, watch, setValue, control } = useForm();
  const [numberOfResults, setNumberOfResults] = useState(itemsPerPage);
  const [filteredResults, setFilteredResults] = useState(allBlogs);
  const [categorySelected, setCategorySelected] = useState(allBlogs);
  const [queryFilterParams, setQueryFilterParams] = useState({});
  const [initialQueryParams, setInitialQueryParams] = useState({});

  const validQueryParams = ["categories", "topics"];

  // categories
  const startingCategory = "All categories";
  const categoryNames = webinar
    ? _.sortBy([..._.map(categories, "name")])
    : _.sortBy([..._.map(categories, "name"), "Use Cases"]);
  const categoriesOptionsArray = [startingCategory, ...categoryNames];
  // topics
  const startingTopic = `All topics`;
  const topicNames = _.map(topics, "name");
  const topicOptionsArray = [startingTopic, ...topicNames];

  const router = useRouter();

  // get initial query params
  useEffect(() => {
    if (preselectedCategory) {
      if (preselectedCategory.topic) {
        setValue("topics", preselectedCategory.name);
      } else {
        setValue("categories", preselectedCategory.name);
      }
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    for (const property in params) {
      if (validQueryParams.includes(property)) {
        if (!preselectedCategory) {
          setValue(property, params[property]);
        }
        delete params[property];
      }
    }

    setInitialQueryParams(params);
  }, []);

  useEffect(() => {
    const handleDone = () => {
      const urlParams = new URLSearchParams(location.search);
      for (const entry of urlParams.entries()) {
        if (!validQueryParams.includes(entry[0])) {
          continue;
        }
        setValue(entry[0], entry[1]);
      }
    };
    router.events.on("routeChangeComplete", handleDone);
  }, [router]);

  // set query params to the url depend on current filter values
  useEffect(() => {
    let newQuery = { ...initialQueryParams, ...queryFilterParams };
    if (preselectedCategory) {
      newQuery = initialQueryParams;
    }

    router.push(
      {
        pathname: new URL(
          `${router.asPath}`,
          `${window.location.protocol}//${window.location.hostname}`
        ).pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true, locale: "en" }
    );
  }, [queryFilterParams]);

  // Establish a reference for all of the blogs being looked at
  const allBlogsRef = useRef();
  useEffect(() => {
    allBlogsRef.current = allBlogs;
  }, [allBlogs]);

  // jumps to the first page
  const jumpToFirstPage = () => {
    setNumberOfResults(itemsPerPage);
  };

  // SORT BY SUPORT
  const sortOptionsArray = webinar
    ? ["Newest", "Oldest", "A-Z", "Z-A"]
    : ["Newest", "Most Popular", "Oldest", "A-Z", "Z-A"];

  useEffect(() => {
    const selectedSortBy = watch("sortBy");

    let newFilteredResults;
    if (selectedSortBy === "Most Popular") {
      if (webinar) {
        newFilteredResults = _.orderBy(
          filteredResults,
          ({ viewCount }) => viewCount || 0,
          "desc"
        );
      } else {
        newFilteredResults = _.orderBy(
          filteredResults,
          ({ popularity }) => popularity || 0,
          "desc"
        );
      }
    } else if (selectedSortBy === "Newest") {
      newFilteredResults = _.orderBy(filteredResults, "date", "desc");
    } else if (selectedSortBy === "Oldest") {
      newFilteredResults = _.orderBy(filteredResults, "date", "asc");
    } else if (selectedSortBy === "Z-A") {
      newFilteredResults = _.orderBy(
        filteredResults,
        (result) => {
          if (webinar) {
            return result.name && result.name.toLowerCase();
          } else {
            return result.title && result.title.toLowerCase();
          }
        },
        "desc"
      );
    } else if (selectedSortBy === "A-Z") {
      newFilteredResults = _.orderBy(
        filteredResults,
        (result) => {
          if (webinar) {
            return result.name && result.name.toLowerCase();
          } else {
            return result.title && result.title.toLowerCase();
          }
        },
        "asc"
      );
    } else {
      newFilteredResults = filteredResults;
    }
    setFilteredResults(newFilteredResults);
    jumpToFirstPage();
  }, [watch("sortBy")]);

  // UseEffect to set the category the user is searching
  useEffect(() => {
    function parseBlogs(selected, selected2) {
      const filteredBlogArray = [];
      allBlogsRef.current.forEach((item) => {
        const blogCategories = (
          _.get(item, "categoriesCollection.items") || []
        ).map((category) => {
          return category.name;
        });
        if (blogCategories.includes(selected)) {
          if (!selected2) {
            filteredBlogArray.push(item);
          } else if (blogCategories.includes(selected2)) {
            filteredBlogArray.push(item);
          }
        }
      });
      setCategorySelected(filteredBlogArray);
    }
    const selectedCategory = watch("categories");
    const selectedTopic = watch("topics");

    if (selectedCategory === "Use Cases") {
      router.push("/use-cases");
    } else if (
      selectedTopic &&
      selectedCategory &&
      selectedTopic !== startingTopic &&
      selectedCategory !== startingCategory
    ) {
      parseBlogs(selectedTopic, selectedCategory);
    } else if (
      (selectedTopic &&
        selectedCategory &&
        selectedTopic !== startingTopic &&
        selectedCategory === startingCategory) ||
      (selectedTopic && !selectedCategory && selectedTopic !== startingTopic)
    ) {
      parseBlogs(selectedTopic);
    } else if (
      selectedTopic &&
      selectedCategory &&
      selectedTopic === startingTopic &&
      selectedCategory !== startingCategory
    ) {
      parseBlogs(selectedCategory);
    } else {
      setCategorySelected(allBlogsRef.current);
    }

    // update url query params
    const queryObject = {};
    if (selectedCategory && selectedCategory !== startingCategory) {
      queryObject.categories = selectedCategory;
    }
    if (selectedTopic && selectedTopic !== startingTopic) {
      queryObject.topics = selectedTopic;
    }
    setQueryFilterParams(queryObject);
  }, [watch("topics"), watch("categories")]);

  // UseEffect to parse the apps based on the search input
  useEffect(() => {
    searchFilter(
      categorySelected,
      watch("searchInput"),
      filteredResults,
      setFilteredResults,
      jumpToFirstPage
    );
    setValue("sortBy", "Newest");
  }, [watch("searchInput"), categorySelected]);

  // Map to create an array of styled search results to display on the page
  function renderResultList() {
    return filteredResults
      .slice(0, numberOfResults)
      .map((blog, index) =>
        webinar ? (
          <WebinarCard key={index} webinar={blog} columns={3} />
        ) : (
          <BlogCard key={index} blog={blog} columns={3} useCase={useCase} />
        )
      );
  }

  // programatically render the number of results that are able to be displayed based on filtered options
  const renderFilteredResultsCaption = `Showing ${
    filteredResults.length === 0
      ? "0"
      : // : filteredResults.length <= numberOfResults
        // ? filteredResults.length
        `1 -
  ${
    numberOfResults > filteredResults.length
      ? filteredResults.length
      : numberOfResults
  } of ${filteredResults?.length}`
  } ${useCase ? "use cases" : webinar ? "webinars" : "blog posts"}`;

  // Function to load more results
  const loadMoreHandler = () => {
    setNumberOfResults(numberOfResults + itemsPerPage);
  };

  // Function to reset the results to the original number of results
  const loadLessHandler = () => {
    setNumberOfResults(itemsPerPage);
  };

  return (
    <div className={cn("container", styles.blogSearchContainer)}>
      <div className={styles.searchHeader}>
        <div className={cn("h2", styles.searchTitle)}>
          {blogIndexData.searchTitle}
        </div>
        <div className={styles.searchInputs}>
          {!useCase ? (
            <Dropdown
              name="categories"
              label="Categories"
              control={control}
              setValue={setValue}
              optionsArray={categoriesOptionsArray}
              defaultValue={categoriesOptionsArray[0]}
              containerClassName={styles.searchDropdown}
            />
          ) : null}
          {!webinar ? (
            <Dropdown
              name="topics"
              label="Topics"
              control={control}
              setValue={setValue}
              optionsArray={topicOptionsArray}
              defaultValue={topicOptionsArray[0]}
              containerClassName={styles.searchDropdown}
            />
          ) : null}
          <Input
            className={styles.searchInput}
            label="Search"
            name="searchInput"
            type="text"
            placeholder="Search"
            register={register}
            validations={{
              required: false,
            }}
            search
          />
        </div>
      </div>
      <div className={styles.filteredResults}>
        <p className={cn("caption", styles.filteredResultsCaption)}>
          {renderFilteredResultsCaption}
        </p>
        <Dropdown
          name="sortBy"
          label="Sort By"
          control={control}
          setValue={setValue}
          optionsArray={sortOptionsArray}
          defaultValue={sortOptionsArray[0]}
          containerClassName={styles.filterDropdown}
          sortBy
        />
      </div>
      <div className={styles.blogResultsContainer}>
        {filteredResults.length === 0 ? (
          <MissingResultsCard
            missingSearchResultsTitle={blogIndexData.missingSearchResultsTitle}
            missingSearchResultsDescription={
              blogIndexData.missingSearchResultsDescription
            }
          />
        ) : (
          renderResultList()
        )}
      </div>

      {filteredResults?.length > numberOfResults ? (
        <button
          className={cn("primary-outline small", styles.loadMore)}
          onClick={loadMoreHandler}
        >
          Load More
        </button>
      ) : null}
      {numberOfResults > itemsPerPage ? (
        <button
          className={cn(
            "primary-outline small",
            styles.loadMore,
            styles.loadLess
          )}
          onClick={loadLessHandler}
        >
          Collapse
        </button>
      ) : null}
    </div>
  );
};

BlogSearch.propTypes = propTypes;

export default BlogSearch;
