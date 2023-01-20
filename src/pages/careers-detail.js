import _ from "lodash";
import { Breadcrumb } from "@components/shared";
import { Layout, SeoFields } from "@components/common";
import { PageSectionWrapper } from "@components/page";
import getPageStaticProps from "@utils/getPageStaticProps";
import PropTypes from "prop-types";
import renderPageSections from "@utils/renderPageSections";

const propTypes = {
  pageData: PropTypes.object.isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
  seoFields: PropTypes.object.isRequired,
};

export default function CareersDetail({ pageData, seoFields, seoConfigData }) {
  const sections = _.get(pageData, "fields.sections") || [];
  const canonicalUrl = _.get(seoConfigData, "canonicalUrl");
  const pageSlug = _.get(pageData, "fields.slug");
  const breadcrumbLink = {
    slug: "/careers",
    name: "View all open positions",
  };

  return (
    <>
      <SeoFields
        seoFields={seoFields}
        canonical={`${canonicalUrl}/${pageSlug}`}
      />
      <PageSectionWrapper sections={sections}>
        <Breadcrumb link={breadcrumbLink}></Breadcrumb>
      </PageSectionWrapper>
      {renderPageSections(sections)}
    </>
  );
}

CareersDetail.propTypes = propTypes;
CareersDetail.Layout = Layout;

export async function getStaticProps() {
  const staticProps = await getPageStaticProps("careers-detail");
  return staticProps;
}
