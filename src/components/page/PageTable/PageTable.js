import React from "react";
import styles from "./PageTable.module.scss";
import _ from "lodash";
import cn from "classnames";
import PropTypes from "prop-types";

import CheckMark from "@icons/CheckMark";
import ComparisonX from "@icons/ComparisonX";

const propTypes = {
  fields: PropTypes.shape({
    chartColumnNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    chartRow: PropTypes.arrayOf(PropTypes.object.isRequired),
    chartRowCollection: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object.isRequired),
    }),
  }).isRequired,
  // TODO: PropTypes
};

// Component that contains the comparison Table on the pricing page
const PageTable = ({ fields }) => {
  const comparedItemsArray = _.get(fields, "chartColumnNames");
  const amountOfCols = comparedItemsArray.length;
  const chartRowArray = _.get(fields, "chartRow")
    ? _.map(fields.chartRow, "fields")
    : _.get(fields, "chartRowCollection.items");

  // Map to render the plan names in the title of the table
  const renderTitles = comparedItemsArray.map((name, index) => {
    return (
      <th key={index} className={cn("font-regular", styles.thStyles)}>
        {name}
      </th>
    );
  });

  // Map to render each of the rows of the table
  const renderChartRow = chartRowArray.map((row, index) => {
    // function that checks if there is a check mark or a description
    // and renders the proper response
    const renderRowStat = (checkMark, description) => {
      let statRender;
      if (checkMark) {
        statRender = (
          <span className={styles.checkmarkWrapper}>
            <CheckMark />
          </span>
        );
      } else if (checkMark === false) {
        statRender = (
          <span className={styles.closeWrapper}>
            <ComparisonX />
          </span>
        );
      } else {
        if (description !== null) {
          statRender = description;
        } else {
          statRender = "-";
        }
      }
      return statRender;
    };

    // Making the component flexible and able to be used with up to 5 cols
    // of compared stats
    let firstCol, secondCol, thirdCol, fourthCol, fifthCol;
    if (amountOfCols >= 1) {
      const firstColStats = renderRowStat(
        row.freeCheckmark,
        row.freeDescription
      );
      firstCol = <td className={styles.statTd}>{firstColStats}</td>;
    }
    if (amountOfCols >= 2) {
      const secondColStats = renderRowStat(
        row.coreCheckmark,
        row.coreDescription
      );
      secondCol = <td className={styles.statTd}>{secondColStats}</td>;
    }
    if (amountOfCols >= 3) {
      const thirdColStats = renderRowStat(row.proCheckmark, row.proDescription);
      thirdCol = <td className={styles.statTd}>{thirdColStats}</td>;
    }
    if (amountOfCols >= 4) {
      const fourthColStats = renderRowStat(
        row.teamsCheckmark,
        row.teamsDescription
      );
      fourthCol = <td className={styles.statTd}>{fourthColStats}</td>;
    }
    if (amountOfCols >= 5) {
      const fifthColStats = renderRowStat(
        row.enterpriseCheckmark,
        row.enterpriseDescription
      );
      fifthCol = <td className={styles.statTd}>{fifthColStats}</td>;
    }

    return (
      <React.Fragment key={index}>
        <tr className={styles.statsRow}>
          <td
            className={cn(
              styles.titleColumn,
              amountOfCols >= 1 && styles.oneCol,
              amountOfCols >= 2 && styles.twoCol,
              amountOfCols >= 3 && styles.threeCol,
              amountOfCols >= 4 && styles.fourCol,
              amountOfCols >= 5 && styles.fiveCol
            )}
          >
            {row.title}
          </td>
          {firstCol && firstCol}
          {secondCol && secondCol}
          {thirdCol && thirdCol}
          {fourthCol && fourthCol}
          {fifthCol && fifthCol}
        </tr>
      </React.Fragment>
    );
  });

  return (
    <div>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr className={styles.tableHeader}>
              <th
                className={cn(
                  "font-regular",
                  styles.thStyles,
                  styles.comparisonHeader,
                  amountOfCols >= 1 && styles.oneCol,
                  amountOfCols >= 2 && styles.twoCol,
                  amountOfCols >= 3 && styles.threeCol,
                  amountOfCols >= 4 && styles.fourCol,
                  amountOfCols >= 5 && styles.fiveCol
                )}
              >
                {fields.chartTitle}
              </th>
              {renderTitles}
            </tr>
          </thead>
          <tbody>{renderChartRow}</tbody>
        </table>
      </div>
    </div>
  );
};

PageTable.propTypes = propTypes;

export default PageTable;
