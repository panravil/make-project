const templatesCategoryQuery = `
  appCategoryCollection {
    items {
      name
      slug
      hide
      subcategoriesCollection(limit: 20) {
        items {
          name
          slug
          templatesCollection(limit: 1) {
            items {
              name
            }
          }
        }
      }
    }
  }
`;

const templatesTotalQuery = `
  templateCollection {
    total
  }
`;

const templatesQuery = `
  templateCollection(order: name_ASC, skip: $skip, limit: $limit) {
    total
    items {
      priority
      name
      slug
      usage
      description
      categoriesCollection(limit: 10) {
        items {
          name
          slug
        }
      }
      subcategoriesCollection(limit: 20) {
        items {
          name
          slug
        }
      }
      appsCollection(limit: 3) {
        items {
          name
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
`;

const templatesByAppQuery = `
  appCollection(limit: 1, where: { slug: $slug }) {
    items {
      linkedFrom {
        templateCollection(limit: $templateLimit) {
          total
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
`;

const templatesByIds = `
templateCollection(where: { sys: { id_in: $ids } }, limit: $templateLimit) {
    total
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
`;

export {
  templatesCategoryQuery,
  templatesTotalQuery,
  templatesQuery,
  templatesByAppQuery,
  templatesByIds,
};
