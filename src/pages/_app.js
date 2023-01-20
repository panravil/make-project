import "@styles/globals.scss";
import "../components/common/Form/SelectSearch.scss";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";

import { Layout, HeadSeo, CookieBanner } from "@components/common";
import apolloClient from "@services/apolloClient";
import { ApolloProvider } from "@apollo/client";

const propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const methods = useForm();
  const popStateCheckPoint = useRef(false);

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      popStateCheckPoint.current = true;
      return true;
    });

    window.addEventListener("popstate", (e) => {
      if (!popStateCheckPoint.current && e.currentTarget?.location?.pathname) {
        router.push(
          {
            pathname: e.currentTarget?.location?.pathname,
          },
          undefined,
          {
            shallow: true,
            locale: false,
          }
        );
      }
      setTimeout(() => {
        popStateCheckPoint.current = false;
      }, 100);
    });
  }, []);

  useEffect(() => {
    if (window.rudderanalytics) {
      window.rudderanalytics && window.rudderanalytics.page();
    }
  }, [router.pathname]);

  return (
    <FormProvider {...methods}>
      <ApolloProvider client={apolloClient}>
        <HeadSeo pageProps={pageProps} />
        {!process.env.NEXT_PUBLIC_COOKIELAW_ID ? <CookieBanner /> : null}
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </FormProvider>
  );
}

MyApp.propTypes = propTypes;

export default MyApp;
