const pricingDetailsQuery = `
  pricingPageCollection (limit: 1) {
    items {
      title
      description
      seoFields {
        title
        description
        image {
          title
          url
          width
          height
        }
      }
      showPlansLabel
      annualLabel
      monthLabel
      currentPlanTitle
      popularPlanTitle
      seeDetailsText
      operationsPerMonthText
      operationsPerYearText
      dropdownReachOutText
      planCardsCollection {
        items {
          mostPopularOption
          priceDescriptionMonth
          priceDescriptionYear
          planTitle
          planDescription
          upgradeButton {
            name
            slug
            dataRole
            dataCta
          }
          demoRequestLink {
            name
            slug
            dataRole
            dataCta
            external
          }
          planFeaturesTitle
          planFeatures
          annualShowMonthlyOperations
          pricingJson
        }
      }
      enterpriseToolTip
      enterpriseTitle
      enterpriseUseDescription
      enterpriseSubdescription
      enterpriseButton {
        name
        slug
        dataRole
        dataCta
      }
      enterpriseDemoRequestLink {
        name
        slug
        dataRole
        dataCta
        external
      }
      enterpriseFeaturesTitle
      enterpriseFeatures
      comparisonChartTitle
      comparisonChart {
        chartTitle
        planNames
        chartRowCollection {
          items {
            title
            toolTip
            freeCheckmark
            freeDescription
            coreCheckmark
            coreDescription
            proCheckmark
            proDescription
            teamsCheckmark
            teamsDescription
            enterpriseCheckmark
            enterpriseDescription
          }
        }
      }
      faq {
        title
        questionEntryCollection {
          items {
            title
            description
          }
        }
        link {
          name
          slug
          dataRole
          dataCta
          external
        }
        backgroundColor
      }
      supportTitle
      supportLink {
        name
        slug
        dataRole
        dataCta
        external
      }
    }
  }
`;

export { pricingDetailsQuery };
