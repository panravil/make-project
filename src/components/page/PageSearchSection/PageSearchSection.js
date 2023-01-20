import styles from "./PageSearchSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { Link, Modal } from "@components/common";
import { Search } from "@components/shared";
import { PageContainer, PageSectionWrapper } from "@components/page";
import replaceRangeWildCard from "@utils/replaceRangeWildCard";
import { ContactPartner } from "@components/forms";
import { useState } from "react";

const propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object.isRequired),
  templates: PropTypes.arrayOf(PropTypes.object.isRequired),
  partners: PropTypes.arrayOf(PropTypes.object.isRequired),
  partnerDetailsGlobal: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.object.isRequired),
  subcategories: PropTypes.arrayOf(PropTypes.object.isRequired),
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
    searchOnly: PropTypes.bool,
    advanced: PropTypes.bool,
    cardsTitle: PropTypes.string,
    cards: PropTypes.arrayOf(PropTypes.object.isRequired),
    missingSearchResultsTitle: PropTypes.string.isRequired,
  }).isRequired,
  sections: PropTypes.array.isRequired,
  index: PropTypes.number,
  currentCategory: PropTypes.object,
};

// Component that renders the Connect Apps section of the home page
const PageSearchSection = ({
  apps,
  templates,
  partners,
  partnerDetailsGlobal,
  categories,
  subcategories,
  fields,
  sections,
  index,
  currentCategory,
}) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const searchOnly = _.get(fields, "searchOnly");
  const advanced = _.get(fields, "advanced");
  const cardsTitle = _.get(fields, "cardsTitle");
  const cards = _.get(fields, "cards");
  const contactCard = _.get(partnerDetailsGlobal, "contactCard");
  const missingSearchResultsTitle = _.get(fields, "missingSearchResultsTitle");
  const missingSearchResultsDescription = _.get(
    fields,
    "missingSearchResultsDescription"
  );
  const itemDefaultImage = _.get(fields, "itemDefaultImage.fields");

  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      <PageSectionWrapper fields={fields} sections={sections} index={index}>
        <PageContainer className={styles.pageColumnSection} animateBottom>
          {!searchOnly && (
            <>
              {subtitle ? <p>{subtitle}</p> : null}
              {index === 0 ? <h1>{title}</h1> : <h2>{title}</h2>}
              {description ? (
                <div className={cn("body-large", styles.description)}>
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
              ) : null}
            </>
          )}
          {templates && templates?.length > 0 ? (
            <Search
              allItems={templates}
              categories={categories}
              subcategories={subcategories}
              startingCategory={"All Templates"}
              productType={"Templates"}
              name={"templateSearch"}
              advanced={advanced}
              cardsTitle={cardsTitle}
              cards={cards}
              missingSearchResultsTitle={missingSearchResultsTitle}
              missingSearchResultsDescription={missingSearchResultsDescription}
              currentCategory={currentCategory}
            />
          ) : null}
          {apps && apps?.length > 0 ? (
            <Search
              allItems={apps}
              categories={categories}
              subcategories={subcategories}
              startingCategory={"All Apps"}
              productType={"Apps"}
              name={"appSearch"}
              advanced={advanced}
              cardsTitle={cardsTitle}
              cards={cards}
              missingSearchResultsTitle={missingSearchResultsTitle}
              missingSearchResultsDescription={missingSearchResultsDescription}
              currentCategory={currentCategory}
            />
          ) : null}
          {partners && partners?.length > 0 ? (
            <Search
              allItems={partners}
              contactCard={contactCard}
              categories={categories}
              subcategories={subcategories}
              startingCategory={"All Partners"}
              productType={"Partners"}
              name={"parnterSearch"}
              advanced={advanced}
              cardsTitle={cardsTitle}
              cards={cards}
              missingSearchResultsTitle={missingSearchResultsTitle}
              missingSearchResultsDescription={missingSearchResultsDescription}
              setShowContactModal={setShowContactModal}
              itemDefaultImage={itemDefaultImage}
            />
          ) : null}
          {_.get(link, "slug") && (
            <Link link={link} className={cn("bold", styles.ctaLink)}>
              {replaceRangeWildCard(
                link.name,
                templates ? templates?.length : apps?.length
              )}
            </Link>
          )}
        </PageContainer>
      </PageSectionWrapper>
      {fields.modalForm &&
      partners &&
      partners?.length > 0 &&
      showContactModal ? (
        <Modal
          showModal={showContactModal}
          setShowModal={setShowContactModal}
          noPadding
          restrictClose
          offsetTop
          forceScroll={true}
        >
          <ContactPartner
            fields={fields.modalForm.fields}
            setShowParentModal={setShowContactModal}
          />
        </Modal>
      ) : null}
    </>
  );
};

PageSearchSection.propTypes = propTypes;

export default PageSearchSection;
