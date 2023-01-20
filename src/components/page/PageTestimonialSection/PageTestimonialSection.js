import styles from "./PageTestimonialSection.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { Link } from "@components/common";
import { PageSectionWrapper } from "@components/page";
import Testimonial from "@components/shared/Testimonial";
import AppSlider from "@components/shared/AppSlider";

const propTypes = {
  fields: PropTypes.shape({
    subtitle: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    link: PropTypes.object,
  }).isRequired,
  index: PropTypes.number,
};

// Component that renders the Connect Apps section of the home page
const PageTestimonialSection = ({ fields, sections, index }) => {
  const title = _.get(fields, "title");
  const subtitle = _.get(fields, "subtitle");
  const description = _.get(fields, "description");
  const link = _.get(fields, "link.fields") || _.get(fields, "link");
  const testimonials =
    _.get(fields, "testimonials") ||
    _.get(fields, "testimonialsCollection.items") ||
    [];
  const backgroundColor = _.get(fields, "backgroundColor");
  const darkMode =
    backgroundColor === "dark mode" || backgroundColor === "dark hero mode";

  const renderTestimonials = testimonials.map((testimonial, index) => {
    const fields = _.get(testimonial, "fields") || testimonial;
    return (
      <Testimonial key={index} fields={fields} darkMode={darkMode} footer />
    );
  });

  return (
    <PageSectionWrapper fields={fields} sections={sections} index={index}>
      <div className={cn("container", styles.pageTestimonialSection)}>
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
        <AppSlider
          slidesToShow={4}
          slidesToScroll={1}
          className={styles.pageTestimonialSectionImage}
          darkMode={darkMode}
          arrows
        >
          {renderTestimonials}
        </AppSlider>
      </div>
    </PageSectionWrapper>
  );
};

PageTestimonialSection.propTypes = propTypes;

export default PageTestimonialSection;
