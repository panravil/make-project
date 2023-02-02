import { useState, useEffect, useRef } from "react";
import styles from "./Search.module.scss";
import { useForm } from "react-hook-form";
import cn from "classnames";
import { isMobile } from "react-device-detect";
import _ from "lodash";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

import { Dropdown, Input, Modal, ToggleAccordion } from "@components/common";
import { PageCard } from "@components/page";
import { AppCard, PartnerCard, TemplateCard } from "@components/shared";
import SelectArrow from "@icons/SelectArrow";
import searchFilter from "@utils/searchFilter";
import concatUniqueSortArrays from "@utils/concatUniqueSortArrays";
import MissingResultsCard from "../MissingResultsCard";
import scrollTo from "@utils/scrollTo";
import MatchMeModal from "../MatchMeModal";

const propTypes = {
  allItems: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  contactCard: PropTypes.shape({
    image: PropTypes.object,
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      subcategoriesCollection: PropTypes.shape({
        items: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
          }).isRequired
        ).isRequired,
      }).isRequired,
    }).isRequired
  ),
  subcategories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }).isRequired
  ),
  startingCategory: PropTypes.string.isRequired,
  productType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  advanced: PropTypes.bool,
  cardTitle: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.object.isRequired),
  setShowContactModal: PropTypes.func,
  itemDefaultImage: PropTypes.object,
  currentCategory: PropTypes.object,
};

// Component that handles search functionality and displaying search results
const Search = ({
  allItems,
  contactCard,
  categories = [],
  subcategories = [],
  startingCategory,
  productType,
  name = "Search",
  advanced,
  cardsTitle,
  cards,
  missingSearchResultsDescription,
  missingSearchResultsTitle,
  setShowContactModal,
  itemDefaultImage,
  currentCategory,
}) => {
  let itemsPerPage = !advanced
    ? productType === "Apps"
      ? 27
      : 9
    : productType === "Apps"
      ? isMobile
        ? 12
        : 48
      : isMobile
        ? 4
        : 9;

  if (productType === "Partners") {
    if (isMobile) {
      itemsPerPage = 3;
    } else {
      itemsPerPage = 9;
    }
  }

  const router = useRouter();

  const [queryFilterParams, setQueryFilterParams] = useState({});
  const { register, watch, setValue, control } = useForm();
  const [filteredResults, setFilteredResults] = useState(allItems);
  const [categorySelected, setCategorySelected] = useState(allItems);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [numberOfResults, setNumberOfResults] = useState(itemsPerPage);
  const [initialQueryParams, setInitialQueryParams] = useState({});

  const partnerCard = {
    image: _.get(contactCard, "image"),
    name: _.get(contactCard, "title"),
    countries: [_.get(contactCard, "subtitle")],
    description: _.get(contactCard, "description"),
    link: _.get(contactCard, "link"),
  };

  // SET UP CATEGORIES
  const allCategories = concatUniqueSortArrays(
    [categories, subcategories],
    "name"
  );
  const categoriesOptionsArray = [
    { name: startingCategory },
    ...allCategories,
  ].map((category) => {
    return category.name;
  });

  const allCategoriesSlugsByName = _.chain(allCategories)
    .keyBy("name")
    .mapValues("slug")
    .value();

  // SET UP LOCATION STATE & OPTIONS FOR DROPDOWN
  const startingLocation = "All Locations";
  const locations = concatUniqueSortArrays(
    _.map(allItems, "countries"),
    null,
    null
  );

  // if multiple select, dont add default first option to the option array
  /*const locationOptionsArray =
    locations.length > 0 ? [startingLocation, ...locations] : [];*/
  const locationOptionsArray = locations.length > 0 ? locations : [];

  // SET UP LANGUAGE STATE & OPTIONS FOR DROPDOWN
  const startingLanguage = "All Languages";
  const languages = concatUniqueSortArrays(
    _.map(allItems, "languages"),
    null,
    null
  );
  const languageOptionsArray =
    languages.length > 0 ? [startingLanguage, ...languages] : [];

  // SET UP PARTNER TYPE STATE & OPTIONS FOR DROPDOWN
  const startingPartnerType = "All Partners";
  const partnerTypes = concatUniqueSortArrays(
    _.map(allItems, "partnerType"),
    null,
    null
  );
  let partnerTypeOptionsArray =
    partnerTypes.length > 0 ? [startingPartnerType, ...partnerTypes] : [];
  partnerTypeOptionsArray = partnerTypeOptionsArray.map((item) => {
    let optionName = item;
    switch (item) {
      case "ENT":
        optionName = "Enterprise";
        break;
      case "SMB":
        optionName = "Small and medium-sized business";
        break;
    }
    return {
      name: optionName,
      value: item,
    };
  });

  const startingappsCollectionType = "All Apps & Services";
  const appsCollectionOptionsArray = [
    'All Apps & Services',
    'Airtable',
    'Asana',
    'HTTP'
  ];

  const validQueryParams = [
    "categories",
    "locations",
    "languages",
    "partnerType",
    "appsCollection"
  ];

  useEffect(() => {
    if (currentCategory && validQueryParams.includes(currentCategory.type)) {
      setValue(currentCategory.type, currentCategory.name);
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    for (const property in params) {
      if (validQueryParams.includes(property)) {
        if (!currentCategory || currentCategory.type !== property) {
          setValue(property, params[property]);
        }

        delete params[property];
      }
    }

    if (productType === "Templates" && (params["apps"] || params["app"])) {
      let setTemplateSearch = params["apps"];
      if (!setTemplateSearch) {
        setTemplateSearch = params["app"];
        delete params["app"];
      } else {
        delete params["apps"];
      }

      setValue("searchInput", setTemplateSearch);
    }

    setInitialQueryParams(params);
  }, []);

  useEffect(() => {
    const handleDone = () => {
      if (currentCategory) {
        return;
      }
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

  useEffect(() => {
    let newQuery = { ...initialQueryParams, ...queryFilterParams };
    console.log('newQuery is ', newQuery);
    if (currentCategory) {
      newQuery = { ...initialQueryParams };
    }

    const urlObject = new URL(
      router.asPath,
      `${window.location.protocol}//${window.location.hostname}`
    );
    let pathName = urlObject.pathname;

    let pathNameStart = pathName.split("/");
    pathNameStart = pathNameStart[1];
    const categoryToUrlPaths = ["integrations", "templates"];
    if (pathNameStart && categoryToUrlPaths.includes(pathNameStart)) {
      const categorySlug =
        allCategoriesSlugsByName[queryFilterParams.categories];
      if (categorySlug && queryFilterParams.categories) {
        pathName = `/${pathNameStart}/category/${categorySlug}`;
      } else {
        pathName = `/${pathNameStart}`;
      }
      newQuery = { ...initialQueryParams };

      const newPathname = `/${router.locale}${pathName}`;

      if (window.location.pathname !== newPathname) {
        window.history.pushState(
          null,
          "",
          `${newPathname}${newQuery.length ? `?${_.toQuery(newQuery)}` : ""}`
        );
      }
    } else {
      router.push(
        {
          pathname: new URL(
            router.asPath,
            `${window.location.protocol}//${window.location.hostname}`
          ).pathname,
          query: newQuery,
        },
        undefined,
        {
          shallow: true,
          locale: "en",
        }
      );
    }
  }, [queryFilterParams]);

  // Establish a reference for all of the apps being looked at
  const allItemsRef = useRef();
  useEffect(() => {
    allItemsRef.current = allItems;
  }, [allItems]);

  // returns the user to the first page
  const jumpToFirstPage = () => {
    setNumberOfResults(itemsPerPage);
  };

  // SORT BY SUPORT
  // DETERMINE IF WE CAN ACTUALLY SORT BY MOST POPULAR
  let isPopular =
    concatUniqueSortArrays([
      _.map(allItems, "priority"),
      _.map(allItems, "score"),
    ]).length > 0;

  // disable most popular sorting for partners
  if (productType === "Partners") {
    isPopular = false;
  }

  const sortOptionsArray = isPopular
    ? ["Most Popular", "A-Z", "Z-A"]
    : ["A-Z", "Z-A"];

  const sortItems = (filtered) => {
    const selectedSortBy = watch("sortBy");
    let newFilteredResults;
    if (selectedSortBy === "Most Popular") {
      newFilteredResults = _.orderBy(
        _.orderBy(
          filtered || filteredResults,
          "score",
          productType === "Partners" ? "asc" : "desc"
        ),
        "priority",
        "desc"
      );
    } else if (selectedSortBy === "Z-A") {
      newFilteredResults = _.orderBy(
        filtered || filteredResults,
        (result) => {
          return result.name && result.name.toLowerCase();
        },
        "desc"
      );
    } else if (selectedSortBy === "A-Z") {
      newFilteredResults = _.orderBy(
        filtered || filteredResults,
        (result) => {
          return result.name && result.name.toLowerCase();
        },
        "asc"
      );
    } else {
      newFilteredResults = filtered || filteredResults;
    }
    setFilteredResults(newFilteredResults);
    jumpToFirstPage();
  };

  useEffect(() => {
    sortItems();
  }, [watch("sortBy")]);

  // UseEffect to set the category the user is searching
  useEffect(() => {
    const selectedCategory = watch("categories");
    const selectedLocation = watch("locations");
    const selectedLanguage = watch("languages");
    const selectedPartnerType = watch("partnerType");
    const selectedappsCollection = watch("appsCollection");
    console.log("selectedappsCollection is ", selectedappsCollection);

    if (
      (selectedCategory === startingCategory || !selectedCategory) &&
      (selectedLocation === startingLocation || !selectedLocation) &&
      (selectedLanguage === startingLanguage || !selectedLanguage) &&
      (selectedPartnerType === startingPartnerType || !selectedPartnerType) &&
      (selectedappsCollection === startingappsCollectionType || !selectedappsCollection)
    ) {
      setCategorySelected(allItemsRef.current);
    } else {
      const filteredTemplateArray = [];
      allItemsRef.current.forEach((item) => {
        // Create an array of current categories that is a
        // combination of categories and sub categories
        const currentCategories = (
          concatUniqueSortArrays(
            [
              _.get(item, "subcategoriesCollection.items"),
              _.get(item, "categoriesCollection.items"),
            ],
            "name"
          ) || []
        ).map((category) => {
          return category.name;
        });
        // Filter the Templates based on if the category name is one of the
        // listed categories for the template
        if (
          currentCategories.includes(selectedCategory) ||
          selectedCategory === startingCategory ||
          !selectedCategory
        ) {
          if (
            (_.get(item, "countries") || []).includes(selectedLocation) ||
            selectedLocation === startingLocation ||
            !selectedLocation
          ) {
            if (
              (_.get(item, "languages") || []).includes(selectedLanguage) ||
              selectedLanguage === startingLanguage ||
              !selectedLanguage
            ) {
              if (
                (_.get(item, "partnerType") || []).includes(
                  selectedPartnerType
                ) ||
                selectedPartnerType === startingPartnerType ||
                !selectedPartnerType
              ) {
                if (
                  _.filter((_.get(item, "appsCollection.items") || []), (item) => {
                    return selectedappsCollection.includes(item.name)
                  }).length > 0 ||
                  selectedappsCollection === startingappsCollectionType ||
                  !selectedappsCollection
                ) {
                  filteredTemplateArray.push(item);
                }
              }
            }
          }
        }
      });
      setCategorySelected(filteredTemplateArray);
    }

    // update url query params
    const queryObject = {};
    if (selectedCategory && selectedCategory !== startingCategory) {
      queryObject.categories = selectedCategory;
    }
    if (selectedLocation && selectedLocation !== startingLocation) {
      queryObject.locations = selectedLocation;
    }
    if (selectedLanguage && selectedLanguage !== startingLanguage) {
      queryObject.languages = selectedLanguage;
    }
    if (selectedPartnerType && selectedPartnerType !== startingPartnerType) {
      queryObject.partnerType = selectedPartnerType;
    }
    if (selectedappsCollection && selectedappsCollection !== startingappsCollectionType) {
      queryObject.appsCollection = selectedappsCollection
    }

    setQueryFilterParams(queryObject);
  }, [
    watch("categories"),
    watch("locations"),
    watch("languages"),
    watch("partnerType"),
    watch("appsCollection")
  ]);

  // UseEffect to parse the apps based on the search input
  useEffect(() => {
    const searchInputValue = watch("searchInput");
    const filtered = searchFilter(
      categorySelected,
      watch("searchInput"),
      filteredResults,
      setFilteredResults,
      jumpToFirstPage
    );
    setValue("sortBy", isPopular ? "Most Popular" : "A-Z");

    if (searchInputValue.trim() === "") {
      sortItems(filtered);
    }
  }, [watch("searchInput"), categorySelected]);

  // function for handling what option is selected
  useEffect(() => {
    const option = watch("categories");
    const index = _.findIndex(categories, (category) => {
      const subcategoryArray = (
        _.get(category, "subcategoriesCollection.items") || []
      ).map((subcategory) => {
        return subcategory.name;
      });
      return category.name === option || subcategoryArray.includes(option);
    });
    setSelectedIndex(index);
  }, [watch("categories")]);

  // Function to handle opening and closing the category dropdowns
  const handleToggleClick = (category, index) => {
    if (index === selectedIndex) {
      setSelectedIndex(-1);
      setValue("categories", startingCategory);
    } else {
      setSelectedIndex(index);
      setValue("categories", category?.name);
    }
    if (
      advanced &&
      _.get(category, "subcategoriesCollection.items.length") === 0
    ) {
      scrollTo("scrollTo", -40);
    }
  };

  // function to handle clicking of subcategory option that lives
  // underneath a function toggle in desktop view, offset -40 so visually correct
  const handleSubcategoryClick = (option) => {
    setValue("categories", option);
    if (advanced) {
      scrollTo("scrollTo", -40);
    }
  };

  // Logic for handling clicking arrows for left and right scroll
  const rowRef = useRef(null);
  const handleArrowClickLeft = () => {
    const current = rowRef.current;
    if (current) {
      current.scrollLeft -= 200;
    }
  };
  const handleArrowClickRight = () => {
    const current = rowRef.current;
    if (current) {
      current.scrollLeft += 200;
    }
  };

  // Render for displaying number of results based on filter options
  const renderFilteredResultsCaption = `Showing ${filteredResults.length === 0
    ? "0"
    : `1 -
  ${numberOfResults > filteredResults.length
      ? filteredResults.length
      : numberOfResults
    } of ${filteredResults?.length}`
    } ${productType === "Partners" ? "" : `results in ${watch("categories")}`}`;

  // .map that renders the items specific for the page that is selected
  // currentItems for pagination
  const renderCurrentItems =
    filteredResults instanceof Array &&
    filteredResults.slice(0, numberOfResults).map((item, index) => (
      <div className={styles.currentListItem} key={index}>
        {item.__typename === "App" ? (
          <AppCard app={item} key={index} small />
        ) : item.__typename === "Template" ? (
          <TemplateCard template={item} key={index} />
        ) : (
          <PartnerCard
            partner={item}
            key={index}
            itemDefaultImage={itemDefaultImage}
          />
        )}
      </div>
    ));

  const renderPartnerCurrentItems = [
    <div
      className={[styles.currentListItem, styles.matchMeCardWrap, styles.advancedDesktopOnly].join(" ")}
      key={-1}
    >
      {/* <PartnerCard
        partner={partnerCard}
        setShowModal={setShowContactModal}
        extraClasses={["matchMeCard"]}
      /> */}
      <MatchMeModal></MatchMeModal>
    </div>,
    ...renderCurrentItems,
  ];

  // .map that renders top 20 priority items if no results
  const renderSuggestedItems =
    allItems instanceof Array &&
    allItems.slice(0, productType === "Apps" ? 24 : 18).map((item, index) => (
      <div className={styles.currentListItem} key={index}>
        {item.__typename === "App" ? (
          <AppCard app={item} key={index} small />
        ) : item.__typename === "Template" ? (
          <TemplateCard template={item} key={index} />
        ) : (
          <PartnerCard
            partner={item}
            key={index}
            itemDefaultImage={itemDefaultImage}
          />
        )}
      </div>
    ));

  // load more button increases the number of apps displayed
  const loadMoreHandler = () => {
    if (productType === "Partners") {
      setNumberOfResults(numberOfResults + itemsPerPage + 1);
    } else {
      setNumberOfResults(numberOfResults + itemsPerPage);
    }
  };

  // Function to reset the number of results back to the initial number
  const loadLessHandler = () => {
    setNumberOfResults(itemsPerPage);
  };

  const onSubmit = (event) => {
    event.preventDefault();
  };

  const clearFilters = (e) => {
    e.preventDefault();
    setValue("categories", "");
    setValue("locations", "");
    setValue("languages", "");
    setValue("partnerType", "");
    setValue("appsCollection", "")
  };

  // Function that renders the Page Cards
  const renderPageCards = (columns) => {
    return (
      <>
        {cardsTitle && cards?.length > 0 ? (
          <div className={styles.cardSection}>
            {cardsTitle ? (
              columns > 1 ? (
                <h2>{cardsTitle}</h2>
              ) : (
                <p>{cardsTitle}</p>
              )
            ) : null}
            <div className={styles.cardRow}>
              {cards?.length > 0 &&
                cards.map((card, index) => {
                  const fields = _.get(card, "fields");
                  return (
                    <PageCard
                      key={index}
                      fields={fields}
                      cardGradientBorder
                      columns={columns}
                    />
                  );
                })}
            </div>
          </div>
        ) : null}
      </>
    );
  };

  if (advanced) {
    return (
      <>
        <form
          name={name}
          onSubmit={onSubmit}
          className={cn(
            styles.searchContainer,
            !advanced ? styles.pageSection : "",
            !categories?.length > 0 ? styles.noCategoriesAdvanced : ""
          )}
          id="scrollTo"
        >
          {!categories?.length > 0 ? (
            <Input
              className={styles.searchInput}
              // label="Search"
              name="searchInput"
              type="text"
              placeholder="Search"
              register={register}
              validations={{
                required: false,
              }}
              search
              gradient
            />
          ) : null}
          {productType === "Partners" ? (
            <>
              <div className={styles.partnerFiltersRow}>
                <Dropdown
                  name="locations"
                  label="Locations"
                  placeholder={startingLocation}
                  control={control}
                  setValue={setValue}
                  optionsArray={locationOptionsArray}
                  defaultValue={locationOptionsArray[0]}
                  multiselect={true}
                />
                <Dropdown
                  name="languages"
                  label="Languages"
                  placeholder={startingLanguage}
                  control={control}
                  setValue={setValue}
                  optionsArray={languageOptionsArray}
                  defaultValue={languageOptionsArray[0]}
                  multiselect={true}
                />
                <Dropdown
                  name="partnerType"
                  label="Partner Types"
                  placeholder={startingPartnerType}
                  control={control}
                  setValue={setValue}
                  optionsArray={partnerTypeOptionsArray}
                  defaultValue={partnerTypeOptionsArray[0]}
                  multiselect={true}
                />
                <Dropdown
                  name="appsCollection"
                  label="Apps & Services"
                  placeholder={startingappsCollectionType}
                  control={control}
                  setValue={setValue}
                  optionsArray={appsCollectionOptionsArray}
                  defaultValue={appsCollectionOptionsArray[0]}
                  multiselect={true}
                />
              </div>
              <div className={cn(styles.clearFilterButton, styles.advancedDesktopOnly)}>
                <a onClick={clearFilters} >&times; Clear all filters</a>
              </div>
            </>
          ) : null}
          <div className={styles.searchFormWrapper}>
            <div className={styles.searchForm}>
              {categories?.length > 0 ? (
                <Input
                  className={cn(styles.searchInput)}
                  // label="Search"
                  name="searchInput"
                  type="text"
                  placeholder="Search"
                  register={register}
                  validations={{
                    required: false,
                  }}
                  search
                  gradient
                />
              ) : null}
              <div className={styles.searchCategoriesFilter}>
                {categories?.length > 0 ? (
                  <div className={styles.advancedDesktopOnly}>
                    <p>Browse by Category</p>
                    {categories.map((category, index) => {
                      return (
                        <ToggleAccordion
                          key={index}
                          index={index}
                          selectedIndex={selectedIndex}
                          title={category.name}
                          onClick={() => handleToggleClick(category, index)}
                        >
                          <>
                            {_.get(category, "subcategoriesCollection.items")
                              ? _.sortBy(
                                _.get(
                                  category,
                                  "subcategoriesCollection.items"
                                ),
                                "name"
                              ).map((subcategory, index) => {
                                if (
                                  _.get(
                                    subcategory,
                                    "templatesCollection.items.length"
                                  ) > 0 ||
                                  productType === "Apps" ||
                                  productType === "Partners"
                                ) {
                                  return (
                                    <div
                                      key={index}
                                      className={cn(
                                        "caption",
                                        styles.subcategory,
                                        watch("categories") ===
                                          subcategory.name
                                          ? styles.selectedOption
                                          : ""
                                      )}
                                      onClick={() =>
                                        handleSubcategoryClick(
                                          subcategory.name
                                        )
                                      }
                                      onKeyPress={() =>
                                        handleSubcategoryClick(
                                          subcategory.name
                                        )
                                      }
                                      role="button"
                                      tabIndex={0}
                                    >
                                      {subcategory.name}
                                    </div>
                                  );
                                }
                              })
                              : null}
                          </>
                        </ToggleAccordion>
                      );
                    })}
                    {renderPageCards(1)}
                  </div>
                ) : null}
                <div className={styles.advancedMobileOnly}>
                  {categories?.length > 0 ? (
                    <Dropdown
                      name="categories"
                      label="Categories"
                      control={control}
                      setValue={setValue}
                      optionsArray={categoriesOptionsArray}
                      defaultValue={categoriesOptionsArray[0]}
                      gradient
                    />
                  ) : null}
                  {productType === "Partners" ? (
                    <>
                      <div className={styles.partnerFilters}>
                        <Dropdown
                          name="locations"
                          label="Locations"
                          placeholder={startingLocation}
                          control={control}
                          setValue={setValue}
                          optionsArray={locationOptionsArray}
                          defaultValue={locationOptionsArray[0]}
                          multiselect={true}
                        />
                        <Dropdown
                          name="languages"
                          label="Languages"
                          placeholder={startingLanguage}
                          control={control}
                          setValue={setValue}
                          optionsArray={languageOptionsArray}
                          defaultValue={languageOptionsArray[0]}
                          multiselect={true}
                        />
                        <Dropdown
                          name="partnerType"
                          label="Partner Types"
                          placeholder={startingPartnerType}
                          control={control}
                          setValue={setValue}
                          optionsArray={partnerTypeOptionsArray}
                          defaultValue={partnerTypeOptionsArray[0]}
                          multiselect={true}
                        />
                        <Dropdown
                          name="appsCollection"
                          label="Apps & Services"
                          placeholder={startingappsCollectionType}
                          control={control}
                          setValue={setValue}
                          optionsArray={appsCollectionOptionsArray}
                          defaultValue={appsCollectionOptionsArray[0]}
                          multiselect={true}
                        />
                      </div>
                      <a onClick={clearFilters}>&times; Clear all filters</a>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <div className={styles.resultsWrapper}>
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
              {/* If there's no results, let user know */}
              {filteredResults?.length === 0 ? (
                productType === "Partners" ? (
                  <div className={styles.missingPartners}>
                    <div className={styles.missingWrapper}>
                      <MissingResultsCard
                        missingSearchResultsTitle={missingSearchResultsTitle}
                        missingSearchResultsDescription={
                          missingSearchResultsDescription
                        }
                        productType={productType}
                        hideImage
                        clearFilters={clearFilters}
                      />
                    </div>
                  </div>
                ) : (
                  <MissingResultsCard
                    missingSearchResultsTitle={missingSearchResultsTitle}
                    missingSearchResultsDescription={
                      missingSearchResultsDescription
                    }
                    productType={productType}
                  >
                    {productType !== "Partners" ? (
                      <div
                        className={cn(
                          styles.currentItems,
                          productType === "Apps" ? styles.small : ""
                        )}
                      >
                        {renderSuggestedItems}
                      </div>
                    ) : null}
                  </MissingResultsCard>
                )
              ) : (
                // otherwise show what results exist
                <>
                  <div
                    className={cn(
                      styles.currentItems,
                      productType === "Apps" ? styles.small : ""
                    )}
                  >
                    {productType === "Partners"
                      ? renderPartnerCurrentItems
                      : renderCurrentItems}
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
                </>
              )}
            </div>
          </div>
        </form>
        {advanced && (
          <div className={styles.advancedMobileOnly}>{renderPageCards(2)}</div>
        )}
      </>
    );
  } else {
    return (
      <form
        name={name}
        onSubmit={onSubmit}
        className={cn(styles.searchContainer, styles.pageSection)}
        id="scrollTo"
      >
        <div className={styles.searchFormWrapper}>
          <div className={styles.searchForm}>
            <Input
              className={cn(styles.searchInput)}
              // label="Search"
              name="searchInput"
              type="text"
              placeholder="Search"
              register={register}
              validations={{
                required: false,
              }}
              search
              gradient
            />
          </div>
          {categories?.length > 0 ? (
            <div className={styles.horizontalScrollRowWrapper}>
              <div className={styles.pageSectionCategoriesFilter} ref={rowRef}>
                {categories.map((category, index) => {
                  return (
                    <div
                      key={index}
                      className={cn(
                        styles.pageSectionCategory,
                        index == selectedIndex ? styles.categorySelected : ""
                      )}
                      onClick={() => handleToggleClick(category, index)}
                      onKeyPress={() => handleToggleClick(category, index)}
                      role="button"
                      tabIndex={0}
                    >
                      {category.name}
                    </div>
                  );
                })}
              </div>
              <div
                className={cn(styles.arrowIcon, styles.leftArrow)}
                onClick={handleArrowClickLeft}
                onKeyPress={handleArrowClickLeft}
                role="button"
                tabIndex={0}
              >
                <SelectArrow />
              </div>
              <div
                className={styles.arrowIcon}
                onClick={handleArrowClickRight}
                onKeyPress={handleArrowClickRight}
                role="button"
                tabIndex={0}
              >
                <SelectArrow />
              </div>
            </div>
          ) : null}
          <div className={styles.resultsWrapper}>
            {/* If there's no results, let user know */}
            {filteredResults?.length === 0 ? (
              <MissingResultsCard
                missingSearchResultsTitle={missingSearchResultsTitle}
                missingSearchResultsDescription={
                  missingSearchResultsDescription
                }
                productType={productType}
              />
            ) : (
              // otherwise show what results exist
              <div
                className={cn(
                  styles.currentItems,
                  productType === "Apps" ? styles.infinitOnRow : ""
                )}
              >
                {renderCurrentItems}
              </div>
            )}
          </div>
        </div>
      </form>
    );
  }
};

Search.propTypes = propTypes;

export default Search;
