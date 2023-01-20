# SITE LAUNCH: FEBRUARY 22, 2022

## SET UP

# THIS REPO WAS INITIALIZED WITH THIS COMMAND

```
npx create-next-app@latest
# or
yarn create next-app
```

Then move contents into root if you initialized from an already initialized project.

# make sure to keep the existing .gitignore, if you screw up, this is the command:

```
git rm -r --cached .
```

# create src folder & throw pages, styles & components in there

# VERIFY NEXT LINE REGARDING NPM & NVM USE

# Optional: we like npm better i guess so delete yarn lock & npm i

check the current version used by vercel -- currently 14
so terminal:
nvm use 14

# jsconfig.json to assist w/ importing

```
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@api/*": ["src/api/*"],
      "@components/*": ["src/components/*"],
      "@config/*": ["src/config/*"],
      "@context/*": ["src/context/*"],
      "@icons/*": ["src/icons/*"],
      "@styles/*": ["src/styles/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

# STARTING INSTALLATIONS FOR STYLING

sass

# Styles setup

Create styles folder
Global scss file called 'globals.scss' & move global css into there to start, once this is moved later into base styles, comment out font-family as this will be defined in variables for actual usage

The scss included above is up for revision, the imports are the important part.

# Import line in app.js:

```
import '../styles/global.scss'
```

# Run npm run dev and make sure you see something

possibly restart server if needed

# File setup for styles folder

Pages folder (& however many other folders)

WE ARE USING file.modules.scss

import global.scss into \_app.js.

# Test this with pages index.js

Create a /pages folder within src/styles
add \_index.module.scss
modify a class
import file straight into page or component (pages/index.js)
test to see reflected chagnes

# yarn add skeleton-scss & copy contents of skeleton-scss/scss into styles for reference

make base folder & copy base reference files into base.

## BTW ORDER OF IMPORTS IN global.scss REALLY REALLY REALLY MATTER

# Recommended order:

```
@import "base/variables";
@import "base/normalize";
@import "base/base-styles";
@import "base/typography";
```

# When using skeleton references, run sass migration to support current standards

```
https://sass-lang.com/documentation/breaking-changes/slash-div
```

# For cool 1 rem = 10px system & scaling up on larger screen sizes put higher up import in base styles:

```
html {
  font-size: 62.5%;
  @media (min-width: 2240px) {
    font-size: 72.9166666667%;
  }
  @media (min-width: 2560px) {
    font-size: 83.3333333333%;
  }
  @media (min-width: 2880px) {
    font-size: 93.75%;
  }
  @media (min-width: 3200px) {
    font-size: 104.166666667%;
  }
  @media (min-width: 3520px) {
    font-size: 114.583333333%;
  }
  @media (min-width: 3840px) {
    font-size: 125%;
  }
}
```

### Take globals from default & throw it into base styles, the important one is box-sizing border box

# Recommended breakpoint variables

# \_variables.scss set defaults

```
// Breakpoints
$bp-xs  : "min-width: 375px" !default;
$bp-sm  : "min-width: 512px" !default;
$bp-md  : "min-width: 768px" !default;
$bp-lg  : "min-width: 1024px" !default;
$bp-xl  : "min-width: 1280px" !default;
$bp-xxl : "min-width: 1440px" !default;
```

# Shorthand for media query breakpoints:

```
@media ($bp-md) {}
```

# When defining typography, h1, .h1 for class accessibility on top of html

Define font example, put fonts in public/fonts, be sure to define before first usage of font (maybe in variables)

```
@font-face {
  font-family: "BrownSTD";
  src: url("/fonts/BrownStd-Regular.otf");
  font-style: normal;
  font-display: swap;
}
```

Mobile first, upsize at breakpoints, do not forget margin bottoms for headings and paragraphs.
Reference Figma for exact sizes and extrapolate in-betweens if needed.

# eslint & prettier install

```
yarn add -D prettier eslint-plugin-react eslint-plugin-prettier eslint-config-prettier eslint @babel/preset-react @babel/eslint-parser @babel/core eslint-plugin-jsx-a11y
```

TODO: figure out babel-eslint upgrade to @babel/core @babel/eslint-parser which will involve some
hilarious times with the babel config because of course it does. :(

# .prettierrc in root

replace generated .prettierrc with Future Foundry common [.prettierrc](https://github.com/Future-Foundry/next-tailwind-directions/blob/main/.prettierrc)

# .eslintrc in root UP FOR REVISION & OPINION, for example extends "next/core-web-vitals"

```
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended"
  ],
  "plugins": ["react", "jsx-a11y", "prettier"],
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "requireConfigFile": false,
    "sourceType": "module",
    "babelOptions": {
      "presets": ["@babel/preset-react"]
    }
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "detect"
    }
  },
  "rules": {
    "prettier/prettier": [
      "warn",
      {
        "endOfLine": "auto"
      }
    ],
    "strict": ["error", "global"],
    "curly": "warn",
    "react/prop-types": "off",
    "no-case-declarations": "off",
    "no-console": "error",
    "quotes": [
      "warn",
      "double",
      {
        "allowTemplateLiterals": true
      }
    ],
    "no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": false
      }
    ],
    "prefer-const": [
      "warn",
      {
        "destructuring": "all",
        "ignoreReadBeforeAssign": false
      }
    ],
    "no-var": "warn",
    "comma-spacing": "warn",
    "semi": ["warn", "always"],
    "object-curly-spacing": ["warn", "always"],
    "object-shorthand": "warn",
    "quote-props": ["warn", "as-needed"],
    "react/react-in-jsx-scope": 0
  }
}
```

Note: in non-next.js projects:
"react/react-in-jsx-scope": 2,
// do error out if you don't have import react statements

as opposed to:
"react/react-in-jsx-scope": 0,
// do not error out if you don't have import react statements

# Add scripts to package.json

```
"eslint": "eslint --fix-dry-run src --ext jsx,js",
"eslintfix": "eslint --fix src --ext jsx,js",
```

Replace generated next.config.js with

```
module.exports = {
  reactStrictMode: true,
  env: {},
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    // Allow images from external domains
    domains: ["images.ctfassets.net"],
  },
};
```

# VSCODE

1. Install VSCode extension called "ESLint by Dirk Baeumer"

2) Then in
   .vscode
   settings.json

Replace generated .vscode/.settings.json with Future Foundry common [.vscode/settings.json](https://github.com/Future-Foundry/next-tailwind-directions/blob/main/.vscode/settings.json)

# Add PropTypes

```
yarn add prop-types
```

Each component that uses PropTypes should have something like this added at the top of the document after the imports with any comment documentation

```
const propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};
```

and at the bottom of the document have

```
NavHeader.propTypes = propTypes
```

# Add Head and Seo

```
yarn add next-seo
```

create a folder inside of src/common for HeadSeo and a file HeadSeo.js inside of it

add the following code to HeadSeo.js

```
import { DefaultSeo } from "next-seo";
import config from "./Seo/seo.json";
import NextHead from "next/head";

const HeadSeo = () => {
  return (
    <>
      <DefaultSeo {...config} />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
    </>
  );
};

export default HeadSeo;
```

create seo.json file inside of HeadSeo folder as well

add the following to it and update values

```
{
  "title": "XXXXXX",
  "titleTemplate": "%s | XXXXXX | XXXXXXX",
  "description": "XXXXXXX",
  "openGraph": {
    "title": "XXXXX | XXXXX",
    "description": "XXXXX",
    "type": "website",
    "locale": "en_IE",
    "url": "XXXXX",
    "site_name": "XXXXXX",
    "images": [
      {
        "url": "https://www.XXXXXXXX.com/SEO/card-new.png",
        "width": 800,
        "height": 600,
        "alt": "XXXXXXX"
      }
    ]
  },
  "twitter": {
    "handle": "XXXXXX",
    "site": "XXXXXXX",
    "cardType": "summary_large_image"
  }
}
```

import into \_app.js above `layout`

To override the seo defaults on a per page basis use

```
import { NextSeo } from 'next-seo'
```

# Create \_document.js

Create a \_document.js file inside of pages. This allows you to edit or add to the HTML body elements outside of next renders

add the following

```
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

# Apollo Setup

website for apollo setup https://www.apollographql.com/blog/apollo-client/next-js/next-js-getting-started/

```

yarn add @apollo/client graphql

```

create .env.local file with contentful space ID and contentful access tokens
create services folder and add apolloClient.js

add to apolloClient.js

```

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
uri: `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`,
cache: new InMemoryCache(),
headers: {
authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
"Content-Language": "en-us",
},
});

export default client;

```

in src create graphql folder with queries.js file

add the gql queries and export them

in index.js

```

import { testQuery } from "src/graphql/query";
import { gql } from "@apollo/client";
import apolloClient from "../services/apolloClient";

```

and after component add

```

export const getAllData = gql` query indexPageQuery { ${testQuery} }`;

export const getStaticProps = async () => {
const { data } = await apolloClient.query({ query: getAllData });
return {
props: { contentfulData: data },
};
};

```

add `contentfulData` to `Home` props

# svg guidelines

svg properties (set by wrapping container):

role="none"
width="100%"
height="100%"
fill="currentColor"

# Keywords for searching through this repo:

```
- TODO
- NOTE
- BUG
- QUESTION
```

# From template:

# Next.js + Tailwind CSS Example

This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v2.2)](https://blog.tailwindcss.com/tailwindcss-2-2) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

It uses the new [`Just-in-Time Mode`](https://tailwindcss.com/docs/just-in-time-mode) for Tailwind CSS.

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-tailwindcss with-tailwindcss-app
# or
yarn create next-app --example with-tailwindcss with-tailwindcss-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

# To be continued...

### FROM INIT

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
