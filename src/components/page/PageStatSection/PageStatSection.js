import styles from "./PageStatSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { Link } from "@components/common";
import { PageImage, PageSectionWrapper } from "@components/page";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    images: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    imagesCollection: PropTypes.shape({
      item: PropTypes.array.isRequired,
    }),
    columns: PropTypes.number,
    cardImageTop: PropTypes.bool,
    statsOnly: PropTypes.bool,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
};

// Component that renders the Connect Apps section of the home page
const PageStatsSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const images =
    _.get(fields, "images") || _.get(fields, "imagesCollection.items") || [];
  const cardImageTop = _.get(fields, "cardImageTop");
  const columns = _.get(fields, "columns");
  const statsOnly = _.get(fields, "statsOnly");

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div className={cn("container", styles.pageSection)}>
        {!statsOnly && subtitle ? <p>{subtitle}</p> : null}
        {!statsOnly ? index === 0 ? <h1>{title}</h1> : <h2>{title}</h2> : null}
        {!statsOnly && description ? (
          <div className={cn("body-large", styles.description)}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ) : null}
        <div className={styles.statRow}>
          {images.map((imageObject, index) => {
            const image = _.get(imageObject, "fields") || imageObject;
            return (
              <div
                key={index}
                className={cn(
                  styles.statContainer,
                  "card-background",
                  columns > 1 ? styles.twoColumns : "",
                  columns > 2 ? styles.threeColumns : "",
                  columns > 3 ? styles.fourColumns : "",
                  cardImageTop ? styles.cardImageTop : ""
                )}
              >
                <div className={cn(styles.statImageRow)}>
                  <div className={styles.statImage}>
                    <PageImage
                      key={index}
                      image={image}
                      layout="fixed"
                      height={48}
                    />
                  </div>
                  <div className="h2">{_.get(image, "description")}</div>
                </div>
                <div>{_.get(image, "title")}</div>
              </div>
            );
          })}
        </div>
        {!statsOnly && _.get(link, "slug") && (
          <Link link={link} className={cn("button gradient", styles.ctaLink)} />
        )}
      </div>
    </PageSectionWrapper>
  );
};

PageStatsSection.propTypes = propTypes;

export default PageStatsSection;
