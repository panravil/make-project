import baseConfig from "@services/baseConfig";

const allBlogSlugsQuery = `
  blogCollection(order: slug_ASC, skip: $skip, limit: $limit, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
      categoriesCollection(limit: 20) {
        items {
          name
          slug
          topic
        }
      }
    }
  }
`;

const blogDetailsQuery = `
  blogCollection(limit: 1, where: {slug: $slug}, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
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
      categoriesCollection(limit: 20) {
        items {
          name
          slug
          topic
        }
      }
      date
      readTime
      image {
        title
        url
        width
        height
      }
      showRichtext
      legacyContent
      bodyText {
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
              __typename
              ... on HtmlBlock {
                html
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
              __typename
              ... on HtmlBlock {
                html
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
      author {
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
      relatedArticlesCollection(limit: 5) {
        items {
          slug
          title
          description
          categoriesCollection(limit: 20) {
            items {
              name
              slug
              topic
            }
          }
          date
          readTime
          image {
            title
            url
            width
            height
          }
          show
          popularity
          featured
        }
      }
      socialLinksCollection {
        items {
          name
          slug
          dataRole
          dataCta
          external
        }
      }
      show
      popularity
      featured
    }
  }
`;

export { allBlogSlugsQuery, blogDetailsQuery };
