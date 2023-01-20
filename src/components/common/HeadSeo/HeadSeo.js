// https://www.npmjs.com/package/next-seo
import { DefaultSeo } from "next-seo";
import NextHead from "next/head";
import _ from "lodash";
import PropTypes from "prop-types";

const propTypes = {
  pageProps: PropTypes.shape({
    seoConfigData: PropTypes.shape({
      defaultTitle: PropTypes.string,
      titleTemplateSeparator: PropTypes.string,
      titleTemplateTrailing: PropTypes.string,
      description: PropTypes.string,
      canonicalUrl: PropTypes.string,
      openGraphType: PropTypes.string,
      openGraphLocale: PropTypes.string,
      openGraphSiteName: PropTypes.string,
      facebookAppId: PropTypes.string,
      twitterHandle: PropTypes.string,
      twitterSite: PropTypes.string,
      twitterCardType: PropTypes.string,
      openGraphImagesCollection: PropTypes.shape({
        items: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string,
            title: PropTypes.string,
            width: PropTypes.number,
            height: PropTypes.number,
          })
        ),
      }),
      additionalMetaTagsJson: PropTypes.arrayOf(
        PropTypes.shape({
          property: PropTypes.string,
          name: PropTypes.string,
          httpEquiv: PropTypes.string,
          content: PropTypes.string.isRequired,
        })
      ),
      additionalLinkTagsJson: PropTypes.arrayOf(
        PropTypes.shape({
          rel: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired,
          as: PropTypes.string,
          type: PropTypes.string,
          crossOrigin: PropTypes.string,
        })
      ),
    }),
  }),
};

const HeadSeo = ({ pageProps }) => {
  const { seoConfigData } = pageProps;
  const seo = seoConfigData;

  const fontsArray = [
    {
      href: "/fonts/Sailec/Sailec-Bold.woff2",
      type: "font/woff2",
    },
    {
      href: "/fonts/Inter/Inter-VariableFont.woff2",
      type: "font/woff2",
    },
    {
      href: "/fonts/Inter/static/Inter-Bold.woff2",
      type: "font/woff2",
    },
    {
      href: "/fonts/Inter/static/Inter-SemiBold.woff2",
      type: "font/woff2",
    },
    {
      href: "/fonts/Inter/static/Inter-Light.woff2",
      type: "font/woff2",
    },
    {
      href: "/fonts/Inter/static/Inter-Medium.woff2",
      type: "font/woff2",
    },
    {
      href: "/fonts/Inter/static/Inter-Regular.woff2",
      type: "font/woff2",
    },
  ];

  const renderFonts = fontsArray.map((font, index) => {
    return (
      <link
        key={index}
        rel="preload"
        href={font.href}
        as="font"
        crossOrigin=""
        type={font.type}
      />
    );
  });

  // Default SEO with a config file
  // Next Head that allows for meta data to be inserted into the head
  return (
    <>
      {/* Populate the Default SEO information from contentful queries */}
      <DefaultSeo
        defaultTitle={seo?.defaultTitle}
        titleTemplate={`%s ${seo?.titleTemplateSeparator} ${seo?.titleTemplateTrailing}`}
        description={seo?.description}
        canonical={seo?.canonicalUrl}
        openGraph={{
          title: seo?.defaultTitle,
          type: seo?.openGraphType,
          locale: seo?.openGraphLocale,
          url: seo?.canonicalUrl,
          site_name: seo?.openGraphSiteName,
          images: (_.get(seo, "openGraphImagesCollection.items") || []).map(
            (image) => {
              return {
                url: image.url,
                title: image.title,
                width: image.width,
                height: image.height,
              };
            }
          ),
        }}
        facebook={{
          appId: seo?.facebookAppId,
        }}
        twitter={{
          handle: seo?.twitterHandle,
          site: seo?.twitterSite,
          cardType: seo?.twitterCardType,
        }}
        additionalMetaTags={seo?.additionalMetaTagsJson}
        additionalLinkTags={seo?.additionalLinkTagsJson}
      />
      {/* NextHead to insert scripts and meta tags */}
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        {renderFonts}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/en/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/en/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/en/apple-touch-icon.png"
        />
        <link rel="manifest" href="/en/site.webmanifest" key="site-manifest" />
        <link rel="icon" href="/en/favicon.ico" />
        {/* script for internal cookie use */}
        {process.env.NEXT_PUBLIC_SITE_URL && (
          <script
            defer
            src={`${process.env.NEXT_PUBLIC_SITE_URL}/assets/hq/js/common.min.js`}
          ></script>
        )}
        {/* script for Rudder Analytics */}
        {process.env.NEXT_PUBLIC_RUDDER_ANALYTICS_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],e.factory=function(t){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(t),e.push(r),e}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),
e.load("${process.env.NEXT_PUBLIC_RUDDER_ANALYTICS_ID}","https://integromat-dataplane.rudderstack.com"),
e.page()}();`,
            }}
          />
        )}
        {/* script for CookieLaw banner */}
        {process.env.NEXT_PUBLIC_COOKIELAW_ID && (
          <>
            <script
              src={"https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"}
              data-document-language="true"
              data-domain-script={`${process.env.NEXT_PUBLIC_COOKIELAW_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `function OptanonWrapper() {}`,
              }}
            />
          </>
        )}
      </NextHead>
    </>
  );
};

HeadSeo.propTypes = propTypes;

export default HeadSeo;
