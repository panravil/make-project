import React from "react";
import Image from "next/image";
import _ from "lodash";
import PropTypes from "prop-types";

const propTypes = {
  image: PropTypes.shape({
    fields: PropTypes.shape({
      title: PropTypes.string.isRequired,
      file: PropTypes.shape({
        url: PropTypes.string.isRequired,
        details: PropTypes.shape({
          image: PropTypes.shape({
            height: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
          }),
        }),
      }),
    }),
    url: PropTypes.string,
    title: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  layout: PropTypes.string,
};

// Handle Image Render w/ variations between rest & graphql
const PageImage = ({
  image,
  width,
  height,
  layout = "responsive",
  objectFit = "cover",
}) => {
  const imageFields = _.get(image, "fields") || image;
  const src = _.get(imageFields, "file.url")
    ? `https:${_.get(imageFields, "file.url")}`
    : _.get(imageFields, "url");
  const title = _.get(imageFields, "title");
  const imageHeight =
    _.get(imageFields, "file.details.image.height") || imageFields?.height;
  const imageWidth =
    _.get(imageFields, "file.details.image.width") || imageFields?.width;

  if (width) {
    return (
      <Image
        src={src}
        alt={title}
        layout={layout}
        sizes={layout !== "fixed" ? `${width / 10}rem` : null}
        height={(imageHeight * width) / imageWidth}
        width={width}
        quality={90}
      />
    );
  } else if (height) {
    return (
      <Image
        src={src}
        alt={title}
        layout={layout}
        sizes={
          layout !== "fixed"
            ? `${(imageWidth * height) / imageHeight / 10}rem`
            : null
        }
        width={(imageWidth * height) / imageHeight}
        height={height}
        quality={90}
      />
    );
  } else {
    return (
      <Image
        src={src}
        alt={title}
        layout={layout}
        objectFit={objectFit}
        quality={90}
      />
    );
  }
};

PageImage.propTypes = propTypes;

export default PageImage;
