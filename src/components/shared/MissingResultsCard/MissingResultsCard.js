import styles from "./MissingResultsCard.module.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import MissingCard from "@icons/MissingCard";

const propTypes = {
  missingSearchResultsDescription: PropTypes.string.isRequired,
  missingSearchResultsTitle: PropTypes.string.isRequired,
  hideImage: PropTypes.true,
  propTypes: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.array.isRequired,
  ]),
  // clearFilters: PropTypes.func,
};

// Component that returns the Missing Results card
const MissingResultsCard = ({
  missingSearchResultsDescription,
  missingSearchResultsTitle,
  productType = "Apps",
  hideImage,
  children,
  // clearFilters,
}) => {
  return (
    <>
      <div className={styles.missingCardContainer}>
        {!hideImage ? (
          <div className={styles.missingCardImage}>
            <MissingCard />
          </div>
        ) : null}
        <div className={cn("h4", styles.missingSearchResultsTitle)}>
          {missingSearchResultsTitle}
        </div>
        <p>{missingSearchResultsDescription}</p>
        {children ? (
          <div className={cn("h4", styles.suggestedTitle)}>
            Suggested{" "}
            {productType === "Templates"
              ? "Templates"
              : productType === "Partners"
              ? "Partners"
              : "Apps"}
          </div>
        ) : null}
        <a
          className={cn("button", "gradient")}
          href="/match-me"
          style={{ width: "auto" }}
        >
          Match me
        </a>
        {/* {clearFilters ? (
          <a onClick={clearFilters}>&times; Clear all filters</a>
        ) : null} */}
      </div>
      {children ? children : null}
    </>
  );
};

MissingResultsCard.propTypes = propTypes;

export default MissingResultsCard;
