const allAppCategorySlugsQuery = `
  appCategoryCollection(order: slug_ASC, skip: $skip, limit: $limit) {
    items {
      slug
    }
  }
`;

const allAppSubcategorySlugsQuery = `
  appSubcategoryCollection(order: slug_ASC, skip: $skip, limit: $limit) {
    items {
      slug
    }
  }
`;

const singleAppCategory = `
  appCategoryCollection(limit: 1, where: { slug: $slug }) {
    items {
      name
      slug
    }
  }
`;

const singleAppSubcategory = `
  appSubcategoryCollection(limit: 1, where: { slug: $slug }) {
    items {
      name
      slug
    }
  }
`;

const appsCategoryQuery = `
  appCategoryCollection {
    items {
      name
      slug
      hide
      subcategoriesCollection(limit: 80) {
        items {
          name
          slug
        }
      }
    }
  }
`;

const appsTotalQuery = `
  appCollection {
    total
  }
`;

const appsQuery = `
  appCollection(order: name_ASC, skip: $skip, limit: $limit) {
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
      subcategoriesCollection(limit: 80) {
        items {
          name
          slug
        }
      }
      categoriesCollection(limit: 60) {
        items {
          name
          slug
        }
      }
    }
  }
`;

export {
  appsCategoryQuery,
  appsTotalQuery,
  appsQuery,
  allAppCategorySlugsQuery,
  allAppSubcategorySlugsQuery,
  singleAppCategory,
  singleAppSubcategory,
};
