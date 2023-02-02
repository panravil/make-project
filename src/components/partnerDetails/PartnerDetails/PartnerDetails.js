import styles from "./PartnerDetails.module.scss";

import cn from "classnames";
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";

import { AppCard, AppSlider, Testimonial } from "@components/shared";
import { BlogCard } from "@components/shared";
import Image from "next/image";

const propTypes = {
  partner: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    partnerType: PropTypes.arrayOf(PropTypes.string.isRequired),
    appsCollection: PropTypes.shape({
      items: PropTypes.array,
    }).isRequired,
    categoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ),
    }),
    subcategoriesCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ),
    }),
  }).isRequired,
  detailsGlobal: PropTypes.shape({
    reviewsTitle: PropTypes.string.isRequired,
  }).isRequired,
  setShowReviewModal: PropTypes.func.isRequired,
  setShowContactModal: PropTypes.func.isRequired,
};

// Header component for the App Page
const PartnerDetails = ({
  partner,
  detailsGlobal,
  setShowReviewModal,
  setShowContactModal,
}) => {
  // Render a list of apps styled with the AppCard component
  const appsIncludedArray = _.get(partner, "appsCollection.items") || [];
  const renderAppsIncluded = appsIncludedArray.map((app, index) => {
    return <AppCard key={index} app={app} smallHorizontal />;
  });
  // Render a list of use cases using the blog card component
  const useCasesArray = _.get(partner, "useCasesCollection.items") || [];
  const renderUseCases = useCasesArray.map((blog, index) => {
    return <BlogCard key={index} blog={blog} />;
  });
  const testimonialsArray = _.get(partner, "reviewsCollection.items");
  // Map to render the testimonials that are passed from contentful
  const renderTestimonials = testimonialsArray.map((testimonial, index) => {
    return <Testimonial key={index} fields={testimonial} footer />;
  });

  const countriesArray = _.get(partner, "countries");

  const partnerTypeArray = _.get(partner, "partnerType");
  const partnerTypeArrayReadable = partnerTypeArray.map((item) => {
    switch (item) {
      case "ENT":
        return "Enterprise";
      case "SMB":
        return "Small and medium-sized business";
      default:
        return item;
    }
  });

  const partnerTiersArray = _.get(partner, "tiers");
  const partnerLanguageArray = _.get(partner, "languages");

  // Function to render the subcategories with styling
  const renderSubcategories = () => {
    // Check if there are sub categories, if not render categories. if that is also empty, return 'No Categories'
    if (partnerTypeArray?.length > 0) {
      return partnerTypeArray
        .map((type, index) => {
          return (
            <div key={index} className={cn("caption heading", styles.category)}>
              <div className={styles.placeholderImage} />
              {type}
            </div>
          );
        })
        .slice(0, 4);
    } else {
      return <div>No Badges</div>;
    }
  };

  const formatWebsiteUrl = (website) => {
    const originalUrl = website;
    website = website
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "")
      .replace(/\?(.*?)$/, "");
    return (
      <a href={originalUrl} target={"_blank"} rel={"noreferrer"}>
        {website}
      </a>
    );
  };

  // Returns the buttons to be rendered and used in both desktop and mobile renderings
  const renderButtons = (
    <>
      {/*<button
        className={cn("button primary-outline", styles.appTryButton)}
        onClick={() => setShowReviewModal(true)}
      >
        {detailsGlobal?.ctaReviewText}
      </button>*/}
      <button
        className={cn("button gradient", styles.buttonCaption)}
        onClick={() => setShowContactModal(true)}
      >
        {detailsGlobal?.ctaContactText}
      </button>
    </>
  );

  const partnerTier = _.last(partner?.tiers);

  return (
    <div className={cn("container", styles.partnerDetails)}>
      <div className={styles.partnerInfoContainer}>
        <div className={styles.partnerDescription}>
          <div className={cn(styles.partnersInfo)}>
            <div className={styles.headerContainer}>
              <div className={styles.imageContainer}>
                {
                  partner?.image && (
                    <Image
                      src={partner.image.url}
                      alt={'Partner avatar'}
                      width={60}
                      height={60}
                      className={styles.avatarImage}
                    />
                  )
                }
              </div>
              <div className={styles.title}>
                {
                  partner?.name
                }
              </div>
            </div>
            {partner?.address ? (
              <div className={cn("caption heading", styles.category)}>
                <div className={styles.placeholderImage}>
                  <Image
                    src={"/en/logos/location.png"}
                    alt={"Location"}
                    layout={"fill"}
                  />
                </div>
                {partner?.address}
              </div>
            ) : null}
            {partnerTiersArray?.length ? (
              <div className={cn("caption heading", styles.category)}>
                <div className={styles.placeholderImage}>
                  <Image
                    src={"/en/logos/certified.png"}
                    alt={"Location"}
                    layout={"fill"}
                  />
                </div>
                {partnerTier === "uncertified" ? (
                  <>Partner</>
                ) : (
                  <>{_.capitalize(_.last(partner?.tiers))} partner</>
                )}
              </div>
            ) : null}
            {partnerTypeArray?.length ? (
              <div className={cn("caption heading", styles.category)}>
                <div className={styles.placeholderImage}>
                  <Image
                    src={"/en/logos/business.png"}
                    alt={"Location"}
                    layout={"fill"}
                  />
                </div>
                {partnerTypeArrayReadable.join(", ")}
              </div>
            ) : null}
            {partnerLanguageArray?.length ? (
              <div className={cn("caption heading", styles.category)}>
                <div className={styles.placeholderImage}>
                  <Image
                    src={"/en/logos/language.png"}
                    alt={"Location"}
                    layout={"fill"}
                  />
                </div>
                {partnerLanguageArray.join(", ")}
              </div>
            ) : null}
            {/*{partner?.phone ? (
              <div className={cn("caption heading", styles.category)}>
                <div className={styles.placeholderImage} />
                {partner?.phone}
              </div>
            ) : null}*/}
            {/*{partner?.email ? (
              <div className={cn("caption heading", styles.category)}>
                <div className={styles.placeholderImage} />
                {partner?.email}
              </div>
            ) : null}*/}
            {partner?.website ? (
              <div
                className={cn(
                  "caption heading",
                  styles.category,
                  styles.infoWebsite
                )}
              >
                <div className={styles.placeholderImage}>
                  <Image
                    src={"/en/logos/website.png"}
                    alt={"Location"}
                    layout={"fill"}
                  />
                </div>
                {formatWebsiteUrl(partner?.website)}
              </div>
            ) : null}
          </div>
          <div className={cn(styles.buttonContainer, styles.desktop)}>
            {renderButtons}
          </div>
        </div>
        {/*badges*/}
        {/*<div className={styles.categoriesWrapper}>
          <div className={cn("b", styles.categoriesTitle)}>Badges</div>
          {renderSubcategories()}
        </div>*/}
        <div className={cn(styles.buttonContainer, styles.mobile)}>
          {renderButtons}
        </div>
      </div>
      <div
        className={cn(styles.partnerDetailsContainer, styles.partnerDetailsRow)}
      >
        <div className={styles.detailsColumn}>
          {appsIncludedArray?.length ? (
            <div className={styles.appsIncludedWrapper}>
              <div className={cn("h4", styles.appsIncludedTitle)}>
                Apps Included
              </div>
              <div className={styles.appsContainer}>{renderAppsIncluded}</div>
            </div>
          ) : null}
          {partner?.description?.length ? (
            <div className={styles.aboutWrapper}>
              <div className={cn("h4", styles.appsIncludedTitle)}>About</div>
              <ReactMarkdown className={cn(styles.description)}>
                {partner?.description}
              </ReactMarkdown>
            </div>
          ) : null}
          {countriesArray?.length ? (
            <div className={styles.appsIncludedWrapper}>
              <div className={cn("h4")}>
                Providing services in these locations
              </div>
              <p>{countriesArray.join(", ")}</p>
            </div>
          ) : null}
        </div>
        {useCasesArray.length ? (
          <div className={styles.useCasesColumn}>
            <div className="h4">Use Cases</div>
            {renderUseCases}
          </div>
        ) : null}
        {useCasesArray.length ? (
          <div className={styles.useCasesSlider}>
            <div className="h4">Use Cases</div>
            <AppSlider
              // arrows
              slidesToScroll={1}
              slidesToShow={useCasesArray.length < 3 ? useCasesArray.length : 3}
              className={styles.useCasesSlider}
            >
              {renderUseCases}
            </AppSlider>
          </div>
        ) : null}
      </div>
      {testimonialsArray.length ? (
        <div className={styles.customerReviews}>
          <div className={"h4"}>{detailsGlobal?.reviewsTitle}</div>
          <AppSlider
            slidesToShow={4}
            slidesToScroll={1}
            className={styles.testimonialSection}
            arrows
          >
            {renderTestimonials}
          </AppSlider>
        </div>
      ) : null}
    </div>
  );
};

PartnerDetails.propTypes = propTypes;

export default PartnerDetails;
