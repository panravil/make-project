import baseConfig from "@services/baseConfig";

const blogsTotalQuery = `
  totalCollection: blogCollection(preview: ${baseConfig.showPreviewContent()}) {
    total
  }
`;

const blogsByCategoryTotalQuery = `
blogCategoryCollection(limit: 1, where: { slug: $slug, topic: $isTopic }, preview: ${baseConfig.showPreviewContent()}) {
    items {
      linkedFrom { 
        totalCollection: blogCollection(preview: ${baseConfig.showPreviewContent()}) {
          total
        }
      }
    }
  }
`;

const allBlogSlugsQuery = `
  blogCollection(order: slug_ASC, skip: $skip, limit: $limit, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
      categoriesCollection(limit: 20) {
        items {
          sys {
            id
          }
          name
          slug
          topic
        }
      }
    }
  }
`;

const blogIndexQuery = `
  blogIndexPageCollection(limit: 1, where: { slug: $indexSlug }, preview: ${baseConfig.showPreviewContent()}) {
    items {
      featuredArticle {
        slug
        title
        description
        image {
          title
          url
          width
          height
        }
      }
      showNewestArticle
      featuredTitle
      featuredLinkText
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

const allBlogsQuery = `
  blogCollection(order: date_DESC, skip: $skip, limit: $limit, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug
      title
      description
      categoriesCollection(limit: 20) {
        items {
          sys {
            id
          }
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
      show
      popularity
      featured
    }
  }
`;

const blogFooterQuery = `
  blogFooter: blogIndexPageCollection(limit: 1, where: { slug: $indexSlug }, preview: ${baseConfig.showPreviewContent()}) {
    items {
      shareTitle
      relatedTitle
      blogFooterTitle
      blogFooterDescription
      placeholderText
      subscribeButtonText
    }
  }
`;

const blogsByCategoryQuery = `
  blogCategoryCollection(limit: 1, where: { slug: $slug, topic: $isTopic }, preview: ${baseConfig.showPreviewContent()}) {
    items {
      slug,
      name,
      linkedFrom {
        blogCollection(skip: $skip, limit: $limit, preview: ${baseConfig.showPreviewContent()}) {
          total
          items {
            slug
            title
            description
            categoriesCollection(limit: 20) {
              items {
                sys {
                  id
                }
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
            show
            popularity
            featured
          }
        }
      }
    }
  }
`;

export {
  blogIndexQuery,
  allBlogSlugsQuery,
  allBlogsQuery,
  blogFooterQuery,
  blogsTotalQuery,
  blogsByCategoryQuery,
  blogsByCategoryTotalQuery,
};
