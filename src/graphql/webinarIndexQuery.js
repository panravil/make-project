import baseConfig from "@services/baseConfig";

const webinarsTotalQuery = `
  totalCollection: webinarCollection(preview: ${baseConfig.showPreviewContent()}) {
    total
  }
`;

const allWebinarSlugsQuery = `
  webinarCollection(order: slug_ASC, skip: $skip, limit: $limit, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
    }
  }
`;

const webinarIndexQuery = `
  blogIndexPageCollection(limit: 1, where: { slug: $indexSlug }, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
      featuredTitle
      featuredWebinar {
        date
        slug
        name
        description
        image {
          title
          url
          width
          height
        }
      }
      featuredLink {
        name
        slug
        dataRole
        dataCta
        external
      }
      searchTitle
      missingSearchResultsTitle
      missingSearchResultsDescription
      sliderTitle
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
    }
  }
`;

const allWebinarsQuery = `
  webinarCollection(order: viewCount_DESC, skip: $skip, limit: $limit, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
      name
      image {
        title
        url
        width
        height
      }
      categoriesCollection(limit: 20) {
        items {
          name
          slug
        }
      }
      date
      price
      language
      featured
      upcoming
      lengthMinutes
      viewCount
    }
  }
`;

export {
  webinarIndexQuery,
  allWebinarsQuery,
  webinarsTotalQuery,
  allWebinarSlugsQuery,
};
