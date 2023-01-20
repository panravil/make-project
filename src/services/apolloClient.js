// Set Up
// https://www.apollographql.com/blog/apollo-client/next-js/next-js-getting-started/

// Explore Contentful GraphQL
// `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/explore?access_token=${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { filterUnresolved } from "@services/apolloResponseMiddleware";

const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT;

const defaultOptions = {
  query: {
    errorPolicy: "ignore",
  },
};

if (typeof window === "undefined") {
  defaultOptions["watchQuery"] = {
    fetchPolicy: "no-cache",
  };
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const responseFormatter = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    return filterUnresolved(response);
  });
});

const uri = `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${environment}`;
const httpLink = new HttpLink({
  uri,
  headers: {
    authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
    "Content-Language": "en-us",
  },
});

const clientLink = from([errorLink, responseFormatter, httpLink]);

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: clientLink,
  cache: new InMemoryCache(),
  defaultOptions,
});

export default client;
