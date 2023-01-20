import baseConfig from "@services/baseConfig";

const allPageSlugsQuery = `
  pageCollection(preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
    }
  }
`;

const singlePageSlugsQuery = `
  pageCollection(limit: 1, where: {slug: $slug}, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
    }
  }
`;

const pageQuery = `
  pageCollection(limit: 1, where: {slug: $slug}, preview: ${baseConfig.showPreviewContent()}) {
    items {
      sys {
        id
      }
      slug
      seoFields {
        title
        description
        image {
          title
          url
          width
          height
        }
        noindex
      }
      customTopMenu {
        sys {
          id
        }
        slug
      }
      customFooter {
        sys {
          id
        }
        systemId
      }
    }
  }
`;

export { allPageSlugsQuery, pageQuery, singlePageSlugsQuery };
