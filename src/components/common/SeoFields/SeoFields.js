import { NextSeo } from "next-seo";
import _ from "lodash";
import PropTypes from "prop-types";

const propTypes = {
  seoFields: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }),
  }),
  canonical: PropTypes.string.isRequired,
  noindex: PropTypes.bool,
  nofollow: PropTypes.bool,
  addToTitle: PropTypes.string,
};

// SEO Fields to override defaults
export default function SeoFields({
  seoFields,
  canonical,
  noindex,
  nofollow,
  addToTitle,
  prependTitle,
}) {
  return (
    <NextSeo
      title={`${prependTitle ? `${prependTitle} ` : ""}${_.get(
        seoFields,
        "title"
      )}${addToTitle ? ` ${addToTitle}` : ""}`}
      description={_.get(seoFields, "description")}
      canonical={canonical}
      noindex={noindex}
      nofollow={nofollow}
      openGraph={{
        images: _.get(seoFields, "image")
          ? [
              {
                url: seoFields?.image?.url,
                title: seoFields?.image?.title,
                width: seoFields?.image?.width,
                height: seoFields?.image?.height,
              },
            ]
          : null,
      }}
    />
  );
}

SeoFields.propTypes = propTypes;
