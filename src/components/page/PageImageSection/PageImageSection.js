import _ from "lodash";
import cn from "classnames";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styles from "./PageImageSection.module.scss";

import { Link } from "@components/common";
import { PageContainer, PageImage, PageSectionWrapper } from "@components/page";
import AppSlider from "@components/shared/AppSlider";
import Testimonial from "@components/shared/Testimonial";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    testimonial: PropTypes.object,
    caption: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    imagesCollection: PropTypes.shape({
      items: PropTypes.array.isRequired,
    }),
    imagesMobile: PropTypes.arrayOf(PropTypes.object.isRequired),
    imagesMobileCollection: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object.isRequired),
    }),
    imageLeft: PropTypes.bool,
    imageOnly: PropTypes.bool,
    backgroundColor: PropTypes.string,
    sectionId: PropTypes.string,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
  pageData: PropTypes.object,
};

// Component that renders the Connect Apps section of the home page
const PageImageSection = ({ fields, sections, index, pageData }) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const sectionId = _.get(fields, "sectionId");

  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const testimonial =
    _.get(fields, "testimonial.fields") || _.get(fields, "testimonial");
  const caption = _.get(fields, "caption");
  const imageLeft = _.get(fields, "imageLeft");
  const imageOnly = _.get(fields, "imageOnly");
  const backgroundColor = _.get(fields, "backgroundColor");
  const darkMode =
    backgroundColor === "dark mode" || backgroundColor === "dark hero mode";
  const pageSlug = pageData?.fields?.slug;

  const images =
    _.get(fields, "images") || _.get(fields, "imagesCollection.items");
  const imagesMobile =
    _.get(fields, "imagesMobile") ||
    _.get(fields, "imagesMobileCollection.items");
  const image =
    _.get(fields, "images[0].fields") ||
    _.get(fields, "imagesCollection.items[0]");
  const imageMobile =
    _.get(fields, "imagesMobile[0].fields") ||
    _.get(fields, "imagesMobileCollection.items[0]");

  // Function to handle the different ways to render images
  const renderImages = (images, image, showOnly) => {
    if (_.get(images, "length") > 1) {
      return (
        <AppSlider
          className={cn(
            styles.pageImageRowImage,
            styles.slider,
            showOnly === "desktop" ? styles.desktopOnly : "",
            showOnly === "mobile" ? styles.mobileOnly : ""
          )}
          darkMode={darkMode}
          arrows={imageOnly}
        >
          {images.map((image, index) => {
            return (
              <PageImage
                key={index}
                image={image}
                width={imageOnly ? 1440 : 768}
              />
            );
          })}
        </AppSlider>
      );
    } else {
      return (
        <div
          className={cn(
            styles.pageImageRowImage,
            showOnly === "desktop" ? styles.desktopOnly : "",
            showOnly === "mobile" ? styles.mobileOnly : ""
          )}
        >
          <PageImage image={image} width={imageOnly ? 1440 : 768} />
        </div>
      );
    }
  };

  return (
    <PageSectionWrapper
      fields={fields}
      sections={sections}
      index={index}
      id={sectionId}
    >
      <PageContainer
        data-cy="PageFormSection"
        className={cn(
          styles.pageImageRow,
          pageSlug ? styles[pageSlug] : "",
          imageLeft ? styles.imageLeft : "",
          imageOnly ? styles.imageOnly : "",
          index === 0 ? styles.indexZero : ""
        )}
        animateLeft={imageLeft && !imageOnly}
        animateRight={!imageLeft && !imageOnly}
        animateBottom={imageOnly}
      >
        {!imageOnly ? (
          <div className={cn(styles.pageImageRowDescription)}>
            {subtitle ? <p>{subtitle}</p> : null}
            {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
            {description ? (
              <div className={cn("body-large", styles.description)}>
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            ) : null}
            {_.get(link, "slug") && (
              <div className={styles.pageImageRowLink}>
                <Link
                  link={link}
                  className={index === 0 ? "button gradient" : "bold"}
                >
                  <span>{link?.name}</span>
                </Link>
              </div>
            )}
            {testimonial && (
              <div className={styles.testimonialContainer}>
                <Testimonial fields={testimonial} />
              </div>
            )}
            {caption && <ReactMarkdown>{caption}</ReactMarkdown>}
          </div>
        ) : null}
        {imageMobile ? (
          <>
            {renderImages(images, image, "desktop")}
            {renderImages(imagesMobile, imageMobile, "mobile")}
          </>
        ) : (
          renderImages(images, image)
        )}
      </PageContainer>
    </PageSectionWrapper>
  );
};

PageImageSection.propTypes = propTypes;

export default PageImageSection;
