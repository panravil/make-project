import React from "react";
import styles from "./ComparisonDesktop.module.scss";
import _ from "lodash";
import PropTypes from "prop-types";
import cn from "classnames";
import ReactMarkdown from "react-markdown";

import { Tooltip } from "..";
import ToolTipIcon from "@icons/ToolTipIcon";
import CheckMark from "@icons/CheckMark";

const propTypes = {
  pricingData: PropTypes.shape({
    popularPlanTitle: PropTypes.string.isRequired,
    comparisonChart: PropTypes.shape({
      planNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
      chartRowCollection: PropTypes.shape({
        items: PropTypes.arrayOf(
          PropTypes.shape({
            coreCheckmark: PropTypes.bool.isRequired,
            coreDescription: PropTypes.array,
            enterpriseCheckmark: PropTypes.bool.isRequired,
            enterpriseDescription: PropTypes.array,
            freeCheckmark: PropTypes.bool.isRequired,
            freeDescription: PropTypes.array,
            proCheckmark: PropTypes.bool.isRequired,
            proDescription: PropTypes.array,
            teamsCheckmark: PropTypes.bool.isRequired,
            teamsDescription: PropTypes.array,
            title: PropTypes.string.isRequired,
          }).isRequired
        ).isRequired,
      }).isRequired,
    }).isRequired,
    planCardsCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          mostPopularOption: PropTypes.bool,
        })
      ).isRequired,
    }).isRequired,
    comparisonChartTitle: PropTypes.string.isRequired,
  }).isRequired,
};

// Component that contains the comparison Table on the pricing page
const ComparisonDesktop = ({ pricingData }) => {
  const comparisonData = _.get(pricingData, "comparisonChart");
  const planNameArray = _.get(comparisonData, "planNames");
  const chartRowArray = _.get(comparisonData, "chartRowCollection.items");
  const planCardCollection = _.get(pricingData, "planCardsCollection.items");
  const comparisonChartTitle = _.get(pricingData, "comparisonChartTitle");

  // Map to render the plan names in the title of the table
  const renderPlanNames = planNameArray.map((name, index) => {
    return (
      <th
        key={index}
        className={cn(
          "font-regular",
          styles.thStyles,
          styles[name.toLowerCase()]
        )}
      >
        {name}
      </th>
    );
  });

  // Function that renders what plan is the most popular plan
  const renderPopularPlan = planCardCollection.map((plan, index) => {
    return (
      <td
        key={index}
        className={cn(
          styles.statTd,
          styles.popularRow,
          plan.mostPopularOption && styles.popular
        )}
      >
        {plan.mostPopularOption && pricingData.popularPlanTitle}
      </td>
    );
  });

  // Map to render each of the rows of the table
  const renderChartRow = chartRowArray.map((row, index) => {
    // function that checks if there is a check mark or a description
    // and renders the proper response along with the className to go
    // with that response
    const renderRowStat = (checkMark, description) => {
      let statRender;
      if (checkMark) {
        statRender = (
          <span className={styles.checkmarkWrapper}>
            <CheckMark />
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

    const freeRowStat = renderRowStat(row.freeCheckmark, row.freeDescription);
    const coreRowStat = renderRowStat(row.coreCheckmark, row.coreDescription);
    const proRowStat = renderRowStat(row.proCheckmark, row.proDescription);
    const teamsRowStat = renderRowStat(
      row.teamsCheckmark,
      row.teamsDescription
    );
    const enterpriseRowStat = renderRowStat(
      row.enterpriseCheckmark,
      row.enterpriseDescription
    );

    return (
      <React.Fragment key={index}>
        <tr className={styles.statsRow}>
          <td className={styles.titleColumn}>
            {row.title}
            {row?.toolTip ? (
              <Tooltip content={row.toolTip} direction={"right"}>
                <div className={styles.iconWrapper}>
                  <ToolTipIcon />
                </div>
              </Tooltip>
            ) : null}
          </td>
          <td className={cn(styles.statTd, styles.free)}>{freeRowStat}</td>
          <td className={cn(styles.statTd, styles.core)}>{coreRowStat}</td>
          <td className={cn(styles.statTd, styles.pro)}>{proRowStat}</td>
          <td className={cn(styles.statTd, styles.teams)}>{teamsRowStat}</td>
          <td className={cn(styles.statTd, styles.enterprise)}>
            {enterpriseRowStat}
          </td>
        </tr>
      </React.Fragment>
    );
  });

  return (
    <div className={cn("container", styles.comparisonDesktopContainer)}>
      <div className={cn("h3", styles.chartTitle)}>
        <ReactMarkdown>{comparisonChartTitle}</ReactMarkdown>
      </div>
      <div className={styles.tableWrapper}>
        <table>
          <tbody>
            <tr className={styles.statsRow}>
              <td className={styles.emptyTitleColumn}></td>
              {renderPopularPlan}
              <td className={cn(styles.statTd)}></td>
            </tr>
          </tbody>
          <thead>
            <tr className={styles.tableHeader}>
              <th
                className={cn(
                  "font-regular",
                  styles.thStyles,
                  styles.comparisonHeader
                )}
              >
                {comparisonData.chartTitle}
              </th>
              {renderPlanNames}
            </tr>
          </thead>
          <tbody>{renderChartRow}</tbody>
        </table>
      </div>
    </div>
  );
};

ComparisonDesktop.propTypes = propTypes;

export default ComparisonDesktop;
