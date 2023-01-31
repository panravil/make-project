// GQS Queries for pulling information back from contentful

const appsTotalQuery = `
  totalCollection: appCollection {
    total
  }
`;

const allAppSlugsQuery = `
  appCollection(order: slug_ASC, skip: $skip, limit: $limit) {
    items {
      slug
    }
  }
`;

const appDetailsQuery = `
  appCollection(limit: 1, where: { slug: $slug }) {
    items {
      name
      slug
      icon {
        title
        url
        width
        height
      }
      theme
      beta
      premium
      description
      useCustomDescription
      keywords
      subTitle
      videoUrl
      subDescription
      subcategoriesCollection(limit: 20) {
        items {
          name
          slug
          appsCollection(limit: $appLimit) {
            items {
              name
              slug
              icon {
                title
                url
                width
                height
              }
              theme
            }
          }
        }
      }
      categoriesCollection(limit: 10) {
        items {
          name
          slug
        }
      }
      actionsJson
      aggregatorsJson
      feedersJson
      searchesJson
      transformersJson
      triggersJson
    }
  }
`;
// howItWorksCollection {
//   items {
//     title
//     description
//     time
//   }
// }
// testimonialsCollection {
//   items {
//     author
//     description
//     rating
//   }
// }

const appDetailsGlobalQuery = `
  appDetailsGlobalCollection(limit: 1) {
    items {
      backLink {
        name
        slug
        dataRole
        dataCta
        external
      }
      title
      subtitle
      description
      seoFields {
        title
        description
      }
      cta {
        name
        slug
        dataRole
        dataCta
      }
      cta2 {
        name
        slug
        dataRole
        dataCta
      }
      ctaLink {
        name
        slug
        dataRole
        dataCta
        external
      }
      searchTitle
      searchDescription
      searchPlaceholder
      missingSearchResultsTitle
      missingSearchResultsDescription
      searchLink {
        name
        slug
        dataRole
        dataCta
        external
      }
      templateTitle
      templateDescription
      templatePlaceholder
      triggersTitle
      triggersDescription
      videoTitle
      videoDescription
      videosCollection(limit: 5) {
        items {
          title
          description
          time
          videoUrl
        }
      }
      videoPlaceholderImage{
        title
        url
        width
        height
      }
      faqSection {
        title
        questionEntryCollection(limit: 30) {
          items {
            title
            description
          }
        }
        linkLabel
        link {
          name
          slug
          dataRole
          dataCta
          external
        }
        backgroundColor
      }
      testimonialSection {
        subtitle
        title
        description
        link {
          name
          slug
          dataRole
          dataCta
          external
        }
        backgroundColor
      }
    }
  }
`;

const integrateAppsQuery = `
  appCollection(order: name_ASC, skip: $skip, limit: $limit, where: { AND: [{slug_not: $slug}] }) {
    items {
      priority
      name
      icon {
        title
        url
        width
        height
      }
      slug
      theme
    }
  }
`;

const integrateAppsQueryMultiple = `
  appCollection(order: name_ASC, skip: $skip, limit: $limit, where: { AND: [{slug_not: $slug}, {slug_not: $slug2}] }) {
    items {
      priority
      name
      icon {
        title
        url
        width
        height
      }
      slug
      theme
    }
  }
`;

export {
  appsTotalQuery,
  allAppSlugsQuery,
  appDetailsQuery,
  appDetailsGlobalQuery,
  integrateAppsQuery,
  integrateAppsQueryMultiple,
};
