// GQS Queries for pulling information back from contentful

const partnersTotalQuery = `
  totalCollection: partnerCollection {
    total
  }
`;

const allPartnerSlugsQuery = `
  partnerCollection(order: slug_ASC, skip: $skip, limit: $limit) {
    items {
      slug
    }
  }
`;

const partnerDetailsQuery = `
  partnerCollection(limit: 1, where: { slug: $slug}) {
    items {
    	slug
      name
      image {
        title
        url
        width
        height
      }
      description
      about {
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
      rating
      tiers
      address
      phone
      email
      website
      score
      countries
      department
      industries
      languages
      partnerType
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
        }
      }
      useCasesCollection(limit:5) {
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
        }
      }
      reviewsCollection {
        items {
          description
          authorPhoto {
            title
            url
            width
            height
          }
          author
          jobTitle
        }
      }
    }
  }
`;

const partnerDetailsGlobalQuery = `
  partnerDetailsGlobalCollection(limit: 1) {
    items {
      contactCard {
        link {
          name
          slug
          dataRole
          dataCta
          external
        }
      }
      formTitle
      formDescription
      formWebHook
      formSubmitButtonText
      formSubmitSuccessText
      ctaReviewText
      ctaContactText
      reviewsTitle
      contactForm {
        formTitle
        submitButtonText
        submitWebHook
        submissionModalText
        consentText
        agreementText
      }
    }
  }
`;

export {
  partnersTotalQuery,
  allPartnerSlugsQuery,
  partnerDetailsQuery,
  partnerDetailsGlobalQuery,
};
