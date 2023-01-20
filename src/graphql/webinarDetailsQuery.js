import baseConfig from "@services/baseConfig";

const allWebinarSlugsQuery = `
  webinarCollection(order: slug_ASC, skip: $skip, limit: $limit, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
    }
  }
`;

const webinarDetailsQuery = `
  webinarCollection(limit: 1, where: {slug: $slug}, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
      name
      description
      image {
        title
        url
        width
        height
      }
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
      content {
        json
        links {
          entries {
            inline {
              sys {
                id
              }
              __typename
              ... on Link {
                name
                slug
                dataRole
                dataCta
                external
                description
              }
            }
            block {
              sys {
                id
              }
              __typename
              ... on Link {
                name
                slug
                dataRole
                dataCta
                external
                description
              }
            }
          }
          assets {
            block {
              sys {
                id
              }
              url
              title
              width
              height
              description
              contentType
            }
          }
        }
      }
      date
      price
      language
      upcoming
      video {
        title
        url
        contentType
      }
      embedVideo
      lengthMinutes
      categoriesCollection(limit: 20) {
        items {
          name
          slug
        }
      }
      viewCount
      authorCollection(limit:10) {
        items{
          image {
            title
            url
            width
            height
          }
          name
          description
          link {
            name
            slug
            dataRole
            dataCta
            external
          }
        }
      }
      relatedWebinarsCollection(limit: 5) {
        items {
          slug
          name
          image {
            title
            url
            width
            height
          }
        	date
      		lengthMinutes
      		viewCount
        }
      }
    }
  }
`;

const webinarIndexQuery = `
  blogIndexPageCollection(limit: 1, where: { slug: $indexSlug }, preview: ${baseConfig.showPreviewContent()}) {
    items {
      relatedTitle
    }
  }
`;

export { allWebinarSlugsQuery, webinarDetailsQuery, webinarIndexQuery };
