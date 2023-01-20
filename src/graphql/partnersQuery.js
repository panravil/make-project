const partnersTotalQuery = `
  partnerCollection {
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

const partnersQuery = `
  partnerCollection(order: score_ASC, skip: $skip, limit: $limit) {
    items {
    	slug
      name
      image {
        title
        url
        width
        height
      }
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
      description
      rating
      tiers
      countries
      languages
      partnerType
      score
      address
    }
  }
`;

const partnerDetailsGlobalQuery = `
  partnerDetailsGlobalCollection(limit: 1) {
    items {
      contactCard {
        image {
          title
          url
          width
          height
        }
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
      }
    }
  }
`;

export {
  partnersTotalQuery,
  allPartnerSlugsQuery,
  partnersQuery,
  partnerDetailsGlobalQuery,
};
