import styles from "./PartnerDetailsHeader.module.scss";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import { TemplateIcon } from "@components/shared";
import { PageImage } from "@components/page";

const propTypes = {
  partner: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
    partnerType: PropTypes.arrayOf(PropTypes.string.isRequired),
    appsCollection: PropTypes.shape({
      items: PropTypes.array,
    }).isRequired,
    tiers: PropTypes.arrayOf(PropTypes.string.isRequired),
  }).isRequired,
  detailsGlobal: PropTypes.shape({
    ctaReviewText: PropTypes.string.isRequired,
    ctaContactText: PropTypes.string.isRequired,
    contactCard: PropTypes.shape({
      link: PropTypes.object,
    }).isRequired,
  }).isRequired,
};

// Header component for the App Page
const PartnerDetailsHeader = ({ partner, detailsGlobal }) => {
  // Render a list of apps styled with the AppCard component
  const appsIncludedArray = _.get(partner, "appsCollection.items") || [];

  return (
    <div
      data-cy="PartnerDetailsHeader"
      className={cn("container", styles.appHeader)}
    >
      <div className={styles.companyNameContainer}>
        {partner?.image ? (
          <div className={cn(styles.partnerImageWrapper)}>
            <div className={cn(styles.partnerImage)}>
              <PageImage
                image={partner?.image}
                layout={"fill"}
                objectFit={"contain"}
              />
            </div>
          </div>
        ) : (
          <div className={styles.appLogo}>
            <TemplateIcon
              apps={appsIncludedArray}
              dimensions={160}
              className={styles.templateIcon}
            />
          </div>
        )}
        <h1 className="h2">{partner?.name}</h1>
      </div>
    </div>
  );
};

PartnerDetailsHeader.propTypes = propTypes;

export default PartnerDetailsHeader;
