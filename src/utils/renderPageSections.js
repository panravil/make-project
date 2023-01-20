import _ from "lodash";
import {
  PageSearchSection,
  PageCardSection,
  PageChartSection,
  PageColumnSection,
  PageFaqSection,
  PageFormSection,
  PageHeroSection,
  PageImageSection,
  PageLogosSection,
  PageRichTextSection,
  PageStatSection,
  PageTabSection,
  PageTestimonialSection,
  PageVideoSection,
} from "@components/page";

/**
 * Function that helps render PageSections for the page builder part of the site
 * @param {array} sections - collection of sections
 * @param {object} apps - collection of apps
 * @param {object} templates - collection of templates
 * @param {object} categories - collection of categories
 * @param {object} subcategories - Collection of subcategories
 * @param {object} partners - Collection of partners
 * @param {object} partnerDetailsGlobal - Collection of partners global data
 * @param {object} pageData - Current page data
 * @param {object} currentCategory - Current category
 */
export default function renderPageSections(
  sections,
  apps,
  templates,
  categories,
  subcategories,
  partners,
  partnerDetailsGlobal,
  pageData,
  currentCategory
) {
  return sections.map((section, index) => {
    const sysId = _.get(section, "sys.contentType.sys.id");
    const fields = _.get(section, "fields");
    switch (sysId) {
      case "pageAppSearchSection":
        return (
          <PageSearchSection
            apps={apps}
            templates={!apps ? templates : null}
            partners={!apps ? partners : null}
            partnerDetailsGlobal={!apps ? partnerDetailsGlobal : null}
            categories={categories}
            subcategories={subcategories}
            fields={fields}
            sections={sections}
            index={index}
            key={index}
            currentCategory={currentCategory}
          />
        );
      case "pageCardSection":
        return (
          <PageCardSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "pricingPageComparisonChart":
        return (
          <PageChartSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "pricingPageFaq":
        return (
          <PageFaqSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "pageImageSection":
        return (
          <PageImageSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
            pageData={pageData}
          />
        );
      case "pageColumnSection":
        return (
          <PageColumnSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "demoRequestPage":
        return (
          <PageFormSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
            pageData={pageData}
          />
        );
      case "pageHeroSection":
        return (
          <PageHeroSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "pageLogosSection":
        return (
          <PageLogosSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "pageStatSection":
        return (
          <PageStatSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "legalPages":
        return (
          <PageRichTextSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
            pageData={pageData}
          />
        );
      case "pageTabSection":
        return (
          <PageTabSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "pageTestimonialSection":
        return (
          <PageTestimonialSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
          />
        );
      case "pageVideoSection":
        return (
          <PageVideoSection
            fields={fields}
            sections={sections}
            index={index}
            key={index}
            pageData={pageData}
          />
        );
      default:
        return null;
    }
  });
}
