import styles from "./PageSectionWrapper.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import BackgroundBobbleWhite from "@icons/BackgroundBobbleWhite";
import BackgroundBobbleGrey from "@icons/BackgroundBobbleGrey";
import BackgroundBobbleDark from "@icons/BackgroundBobbleDark";

const propTypes = {
  fields: PropTypes.shape({
    className: PropTypes.string,
    backgroundColor: PropTypes.string,
    darkMode: PropTypes.bool,
    prevDark: PropTypes.bool,
    nextDark: PropTypes.bool,
    addPaddingTop: PropTypes.bool,
    addPaddingBottom: PropTypes.bool,
  }).isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        backgroundColor: PropTypes.string,
      }),
      PropTypes.number.isRequired,
    ])
  ),
  index: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.array.isRequired,
  ]).isRequired,
  id: PropTypes.string,
};

// Component that renders the Connect Apps section of the home page
const PageSectionWrapper = ({ fields, sections, index, children, id }) => {
  const className = _.get(fields, "className");
  const backgroundColor = _.get(fields, "backgroundColor");
  const darkMode =
    backgroundColor === "dark mode" || backgroundColor === "dark hero mode";
  const darkHeroMode = backgroundColor === "dark hero mode";
  const prevSection = index > 0 ? sections[index - 1] : null;
  const nextSection = index < sections?.length - 1 ? sections[index + 1] : null;
  const prevDark =
    _.get(fields, "prevDark") ||
    _.get(prevSection, "fields.backgroundColor") === "dark mode" ||
    _.get(prevSection, "fields.backgroundColor") === "dark hero mode";
  const nextDark =
    _.get(fields, "nextDark") ||
    _.get(nextSection, "fields.backgroundColor") === "dark mode" ||
    _.get(nextSection, "fields.backgroundColor") === "dark hero mode";
  const sysId = sections && _.get(sections[index], "sys.contentType.sys.id");
  const addPaddingTop =
    !_.isNull(index) && !_.isNull(prevDark) && sysId !== "pageLogosSection"
      ? (darkMode && !prevDark && index !== 0) || (!darkMode && prevDark)
      : _.get(fields, "addPaddingTop");
  const addPaddingBottom =
    !_.isNull(index) && !_.isNull(nextDark)
      ? (darkMode && !nextDark && index !== sections?.length - 1) ||
        (!darkMode && nextDark) ||
        (!darkMode && index === sections?.length - 1)
      : _.get(fields, "addPaddingBottom");
  let gradientCalculation = "white";
  let bobbleCalculation = "grey";

  // Logic to calculate the colors of the background and bobbles
  switch (backgroundColor) {
    case "white":
      gradientCalculation = "white";
      bobbleCalculation = "grey";
      break;
    case "grey":
      gradientCalculation = "grey";
      bobbleCalculation = "white";
      break;
    case "grey to white":
      gradientCalculation = "grey-to-white-gradient";
      bobbleCalculation = "white";
      break;
    case "white to grey":
      gradientCalculation = "white-to-grey-gradient";
      bobbleCalculation = "grey";
      break;
    case "grey to white to grey":
      gradientCalculation = "grey-to-white-to-grey-gradient";
      bobbleCalculation = "grey";
      break;
    case "white to grey to white":
      gradientCalculation = "white-to-grey-to-white-gradient";
      bobbleCalculation = "white";
      break;
    case "grey to white to white":
      gradientCalculation = "grey-to-white-to-white-gradient";
      bobbleCalculation = "grey";
      break;
    case "white to grey to grey":
      gradientCalculation = "white-to-grey-to-grey-gradient";
      bobbleCalculation = "white";
      break;
    case "grey to grey to white":
      gradientCalculation = "grey-to-grey-to-white-gradient";
      bobbleCalculation = "white";
      break;
    case "white to white to grey":
      gradientCalculation = "white-to-white-to-grey-gradient";
      bobbleCalculation = "grey";
      break;
    case "dark mode":
      gradientCalculation =
        index === sections?.length - 1 && !prevDark
          ? "pre-footer"
          : "dark-background";
      bobbleCalculation = "white";
      break;
    case "dark hero mode":
      gradientCalculation = "dark-hero-background";
      bobbleCalculation = "white";
      break;
    default:
      gradientCalculation = "white";
      bobbleCalculation = "grey";
      break;
  }

  // Rendering the correct bobble after calculations
  const renderBobble = () => {
    if (bobbleCalculation === "grey") {
      return <BackgroundBobbleGrey />;
    } else if (bobbleCalculation === "white") {
      return <BackgroundBobbleWhite />;
    } else if (bobbleCalculation === "dark mode") {
      return <BackgroundBobbleDark />;
    }
  };

  return (
    <section
      className={cn(
        styles.pageSectionWrapper,
        gradientCalculation,
        addPaddingTop ? "add-padding-top" : "",
        addPaddingBottom ? "add-padding-bottom" : "",
        darkMode ? styles.darkMode : "",
        className || ""
      )}
      id={id}
    >
      {!_.isNull(index) &&
      index % 2 === 0 &&
      // !darkHeroMode &&
      !(!darkMode && prevDark) &&
      !(!darkMode && nextDark) &&
      !(darkMode && index === sections?.length - 1) ? (
        <span
          className={cn(
            "background-svg",
            darkMode ? styles.darkMode : "",
            styles.backgroundBobble,
            styles.left
          )}
        >
          {renderBobble()}
        </span>
      ) : null}
      {!_.isNull(index) &&
      index % 2 === 1 &&
      // !darkHeroMode &&
      !(!darkMode && prevDark) &&
      !(!darkMode && nextDark) &&
      !(darkMode && index === sections?.length - 1) ? (
        <span
          className={cn(
            "background-svg",
            darkMode ? styles.darkMode : "",
            styles.backgroundBobble,
            styles.right
          )}
        >
          {renderBobble()}
        </span>
      ) : null}
      {_.isNull(index) &&
      !darkHeroMode &&
      darkMode &&
      index === sections?.length - 1 ? (
        <span
          className={cn(
            "background-svg",
            darkMode ? styles.darkMode : "",
            styles.backgroundBobble,
            styles.fullWidth
          )}
        >
          {renderBobble()}
        </span>
      ) : null}
      {children}
    </section>
  );
};

PageSectionWrapper.propTypes = propTypes;

export default PageSectionWrapper;
