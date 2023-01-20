// https://contentful.github.io/contentful.js/contentful/9.1.18/
// https://www.contentful.com/developers/docs/references/content-delivery-api/
// https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
const host = process.env.NEXT_PUBLIC_CONTENTFUL_HOST;
const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT;

const client = require("contentful").createClient({
  space,
  accessToken,
  host,
  environment,
});

export default client;
