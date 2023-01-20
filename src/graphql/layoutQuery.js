// GQS Queries for pulling information back from contentful
import baseConfig from "@services/baseConfig";

const navbarQueryInner = `
    items {
      slug
      bannerText
      showBanner
      logo {
        title
        url
        width
        height
      }
      logoLink {
        name
        slug
        dataRole
        dataCta
        external
      }
      menuLinksCollection(limit: 10) {
        items {
          link {
            name
            slug
            dataRole
            dataCta
            external
            description
          }
          megaMenuColumnsCollection(limit: 4) {
            items {
              icon {
                title
                url
                width
                height
              }
              iconTitle
              iconDescription
              columnTitle
              columnLinksCollection(limit: 9) {
                items {
                  name
                  slug
                  dataRole
                  dataCta
                  external
                  description
                }
              }
              imageTitle
              image {
                title
                url
                width
                height
              }
              imageLink {
                name
                slug
                dataRole
                dataCta
                external
              }
            }
          }
        }
      }
      signInLinksCollection(limit: 4) {
        items {
          name
          slug
          dataRole
          dataCta
          external
          description
        }
      }
      showMegaMenu
      showModal
      modalHeading,
      modalImage {
                title
                url
                width
                height
              }
      modalText
      modalLink {
                name
                slug
                dataRole
                dataCta
                external
              }
    }
`;

const footerQueryInner = `
    items {
      systemId
      footerType
      ctaTitle
      ctaDescription
      ctaLink {
        name
        slug
        dataRole
        dataCta
        external
      }
      subscribeTitle
      subscribeDescription
      subscribeSubmitText
      subscribeModalText
      footerLinkColumnCollection(limit: 4) {
        items {
          columnTitle
          columnLinkCollection(limit: 9) {
            items {
              name
              slug
              dataRole
              dataCta
              external
            }
          }
        }
      }
      copyrightText
      bottomLinksCollection(limit: 4) {
        items {
          name
          slug
          dataRole
          dataCta
          external
          description
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
    }
`;

const navbarQuery = `
  navbarCollection(limit: 1, where: {slug: $navbarSlug}, preview: ${baseConfig.showPreviewContent()}) {
    ${navbarQueryInner}
  }
`;

const footerQuery = `
  footerCollection(limit: 1, where: {systemId: $footerSystemId}, preview: ${baseConfig.showPreviewContent()}) {
    ${footerQueryInner}
  }
`;

const layoutQuery = `
  navbarCollection(limit: 1, where: {slug: "${baseConfig.getNavbarSlug()}"}, preview: ${baseConfig.showPreviewContent()}) {
    ${navbarQueryInner}
  }

  seoConfigCollection(limit: 1, preview: ${baseConfig.showPreviewContent()}) {
    items {
      defaultTitle
      titleTemplateTrailing
      titleTemplateSeparator
      description
      canonicalUrl
      openGraphType
      openGraphLocale
      openGraphSiteName
      openGraphImagesCollection {
        items {
          title
          url
          width
          height
        }
      }
      facebookAppId
      twitterSite
      twitterHandle
      twitterCardType
      additionalMetaTagsJson
      additionalLinkTagsJson
    }
  }

  footerCollection(limit: 1, where: {systemId: "${baseConfig.getFooterSystemId()}"}, preview: ${baseConfig.showPreviewContent()}) {
    ${footerQueryInner}
  }
`;

export { layoutQuery, navbarQuery, footerQuery };
