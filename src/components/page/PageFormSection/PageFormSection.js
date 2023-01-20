import _ from "lodash";
import cn from "classnames";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styles from "./PageFormSection.module.scss";

import {
  BecomePartner,
  ContactForm,
  ContactPartner,
  OpportunityRegistration,
} from "@components/forms";
import { Link } from "@components/common";
import { PageImage, PageSectionWrapper } from "@components/page";

const propTypes = {
  fields: PropTypes.shape({
    // subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    images: PropTypes.arrayOf(PropTypes.object.isRequired),
    form: PropTypes.string.isRequired,
    desktopRow: PropTypes.bool,
    formOnly: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number,
  pageData: PropTypes.object,
};

// Component that renders the Connect Apps section of the home page
const PageFormSection = ({ fields, sections, index, pageData }) => {
  const title = _.get(fields, "title");
  // const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const image =
    _.get(fields, "images[0].fields") ||
    _.get(fields, "imagesCollection.items[0]");
  const images =
    _.get(fields, "images") || _.get(fields, "imagesCollection.items");
  const form = (_.get(fields, "form") || "").toLowerCase();
  const desktopRow = _.get(fields, "desktopRow");
  const formOnly = _.get(fields, "formOnly");
  const pageSlug = pageData?.fields?.slug;

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div
        data-cy="PageFormSection"
        className={cn(
          "container",
          desktopRow ? styles.desktopRow : "",
          styles.pageColumnSection,
          pageSlug ? styles[pageSlug] : ""
        )}
      >
        {!formOnly ? (
          <div className={styles.descriptionColumn}>
            {/*subtitle ? <p>{subtitle}</p> : null*/}
            {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
            {description ? (
              <div className={cn("body-large", styles.description)}>
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            ) : null}
            {_.get(link, "slug") && (
              <Link
                link={link}
                className={cn("button gradient", styles.ctaLink)}
              />
            )}
            {_.get(images, "length") > 1 ? (
              <div className={styles.logosRow}>
                {images?.map((image, index) => {
                  return (
                    <div key={index} className={styles.businessLogo}>
                      <PageImage image={image} layout="fixed" height={32} />
                    </div>
                  );
                })}
              </div>
            ) : image ? (
              <div className={styles.pageColumnSectionImage}>
                <PageImage image={image} width={1024} />
              </div>
            ) : null}
          </div>
        ) : null}
        <div className={styles.formColumn}>
          {form === "become partner" ? (
            <BecomePartner fields={fields} />
          ) : form === "contact partner" ? (
            <ContactPartner fields={fields} />
          ) : form === "orf" ? (
            <OpportunityRegistration fields={fields} />
          ) : (
            <ContactForm fields={fields} />
          )}
        </div>
      </div>
    </PageSectionWrapper>
  );
};

PageFormSection.propTypes = propTypes;

export default PageFormSection;
