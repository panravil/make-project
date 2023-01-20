import _ from "lodash";
import PropTypes from "prop-types";

import getPageStaticProps from "@utils/getPageStaticProps";
import renderPageSections from "@utils/renderPageSections";
import { Layout } from "@components/common";

const propTypes = {
  pageData: PropTypes.object.isRequired,
  seoConfigData: PropTypes.shape({
    canonicalUrl: PropTypes.string.isRequired,
  }),
};

export default function HomePage({
  pageData,
  apps,
  templates,
  categories,
  subcategories,
}) {

  const sections = _.get(pageData, "fields.sections") || [];
  return (
    <>
      {renderPageSections(sections, apps, templates, categories, subcategories)}
    </>
  );
}

HomePage.propTypes = propTypes;

HomePage.Layout = Layout;

export async function getStaticProps(context) {
  // console.log('regeneration called!', context);
  const staticProps = await getPageStaticProps("home");
  return staticProps;
}
