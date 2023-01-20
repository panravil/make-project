// GQS Queries for pulling information back from contentful

const templatesTotalQuery = `
  totalCollection: templateCollection {
    total
  }
`;

const allTemplateSlugsQuery = `
  templateCollection(order: slug_ASC, skip: $skip, limit: $limit) {
    items {
      slug
    }
  }
`;

const templateDetailsQuery = `
  templateCollection(limit: 1, where: {slug: $slug}) {
    items {
      priority
      name
      slug
      makeId
      usage
      appsCollection {
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
          actionsJson
          aggregatorsJson
          feedersJson
          searchesJson
          transformersJson
          triggersJson
        }
      }
      description
      subTitle
      subDescription
      categoriesCollection(limit: 10) {
        items {
          name
          slug
        }
      }
      subcategoriesCollection(limit: 20) {
        total
        items {
          name
          slug
        }
      }
    }
  }
`;

const templateDetailsGlobalQuery = `
  templateDetailsGlobalCollection(limit: 1) {
    items {
      backLink{
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
      missingSearchResultsTitle
      missingSearchResultsDescription
      templateTitle
      templateDescription
      templatePlaceholder
      triggersTitle
      triggersDescription
      templateFaq {
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

const similarTemplatesQuery = `
  similarTemplates: templateCollection(limit: 1, where: {slug: $slug}) {
    items {
      subcategoriesCollection(limit: 20) {
        total
        items {
          templatesCollection(limit: $templateLimit) {
            items {
              priority
              name
              slug
              usage
              description
              appsCollection(limit: 3) {
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
        }
      }
    }
  }
`;

export {
  templatesTotalQuery,
  allTemplateSlugsQuery,
  templateDetailsQuery,
  templateDetailsGlobalQuery,
  similarTemplatesQuery,
};
