import styles from "./PageColumnSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { Link } from "@components/common";
import { PageImage, PageSectionWrapper } from "@components/page";
import AppSlider from "@components/shared/AppSlider";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    images: PropTypes.arrayOf(PropTypes.object.isRequired),
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
};

// Component that renders the Connect Apps section of the home page
const PageColumnSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const image =
    _.get(fields, "images[0].fields") ||
    _.get(fields, "imagesCollection.items[0]");
  const images =
    _.get(fields, "images") || _.get(fields, "imagesCollection.items");
  const backgroundColor = _.get(fields, "backgroundColor");
  const darkMode =
    backgroundColor === "dark mode" || backgroundColor === "dark hero mode";

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div className={cn("container", styles.pageColumnSection)}>
        {subtitle ? <p>{subtitle}</p> : null}
        {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
        {description ? (
          <div className={cn("body-large", styles.description)}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ) : null}
        {_.get(link, "slug") && (
          <Link link={link} className={cn("button gradient", styles.ctaLink)} />
        )}
        {_.get(images, "length") > 1 ? (
          <AppSlider
            className={styles.pageColumnSectionImage}
            darkMode={darkMode}
          >
            {images.map((image, index) => {
              return <PageImage key={index} image={image} width={1440} />;
            })}
          </AppSlider>
        ) : image ? (
          <div className={styles.pageColumnSectionImage}>
            <PageImage image={image} width={1024} />
          </div>
        ) : null}
      </div>
    </PageSectionWrapper>
  );
};

PageColumnSection.propTypes = propTypes;

export default PageColumnSection;
