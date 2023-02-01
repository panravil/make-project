import styles from "./PartnerCard.module.scss";
import cn from "classnames";
import _ from "lodash";
import { Link } from "@components/common";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

import { PageImage } from "@components/page";
import { TemplateIcon } from "@components/shared";
import ReviewStar from "@icons/ReviewStar";

const propTypes = {
  partner: PropTypes.shape({
    appsCollection: PropTypes.shape({
      items: PropTypes.array,
    }),
    name: PropTypes.string,
    slug: PropTypes.string,
    score: PropTypes.number,
    link: PropTypes.object,
  }),
  setShowModal: PropTypes.func,
  extraClasses: PropTypes.array,
  itemDefaultImage: PropTypes.object,
};

// Partner card that can be used to display
// results from the partner search
const PartnerCard = ({
  partner,
  setShowModal,
  extraClasses,
  itemDefaultImage,
}) => {
  const appsIncludedArray = _.get(partner, "appsCollection.items");
  const partnerLink = _.get(partner, "link.slug")
    ? partner?.link
    : {
        slug: `/partners-directory/${partner?.slug}`,
        name: partner?.name,
      };

  const linkProps = {};
  if (setShowModal) {
    linkProps["onClick"] = (e) => {
      e.preventDefault();
      setShowModal(true);
    };
  }

  const renderStarts = (rating) => {
    const starNumber = Math.ceil(rating);
    const stars = [];
    for (let i = 0; i < starNumber; i++) {
      stars.push(<ReviewStar key={i} />);
    }
    return stars;
  };

  const partnerTier = _.last(partner?.tiers);

  const stripTags = (string) => {
    if (!string || !string.length) {
      return "";
    }
    return string.replace(/<\/?[^>]+(>|$)/g, "");
  };

  console.log('partner is ', partner.image);

  return (
    <Link
      data-cy="partner-card"
      className={cn(styles.partnerCard, ...(extraClasses || []))}
      link={partnerLink}
      {...linkProps}
    >
      <div
        className={cn(
          styles.contentWrapper,
          "card-background",
          extraClasses && extraClasses.includes("matchMeCard")
            ? styles.matchMeCardWrapper
            : null
        )}
      >
        <div>
          {partner.image ? (
            <div
              className={
                extraClasses && extraClasses.includes("matchMeCard")
                  ? styles.imageMatchMe
                  : styles.image
              }
            >
              <PageImage image={partner?.image} layout={"fill"} />{" "}
            </div>
          ) : itemDefaultImage ? (
            <div className={styles.imageMatchMe}>
              <PageImage image={itemDefaultImage} layout={"fill"} />{" "}
            </div>
          ) : appsIncludedArray?.length > 0 ? (
            <TemplateIcon
              apps={appsIncludedArray}
              className={styles.templateIcon}
            />
          ) : null}

          <div className={cn("h6", styles.title)}>{partner?.name}</div>

          {partner?.address?.length || partner?.tiers ? (
            <div className={styles.locationWrapper}>
              <span className={styles.location}>{partner?.address}</span>
            </div>
          ) : null}

          {partner?.description ? (
            <ReactMarkdown className={cn("caption", styles.description)}>
              {stripTags(partner?.description)}
            </ReactMarkdown>
          ) : null}

          <div className={styles.row}>
            {partner?.rating ? (
              <div className={cn("small", styles.ratingRow)}>
                {/* <div className={styles.ratingWrapper}>}
                { {partner?.rating ? (
                    <>
                      {<ReviewStar />
                    <span className={cn("font-bold", styles.ratingSpan)}>
                      {partner?.rating}
                    </span>
                    <span className={styles.ratingLight}>/5.0</span>}
                      {renderStarts(partner?.rating)}
                    </>
                  ) : null} }
                { </div> */}
                {partner?.tiers ? (
                  <span
                    className={cn(
                      "small " + styles.tiers,
                      styles[partner?.tiers]
                    )}
                  >
                    {partnerTier === "uncertified" ? (
                      <>Partner</>
                    ) : (
                      <>{_.capitalize(_.last(partner?.tiers))} partner</>
                    )}
                  </span>
                ) : null}
              </div>
            ) : null}

            {_.get(partnerLink, "slug") ? (
              <div
                className={cn(
                  styles.link,
                  extraClasses && extraClasses.includes("matchMeCard")
                    ? ["button gradient", styles.matchMeCardBtn]
                    : "link bold"
                )}
              >
                {_.get(partner, "link")
                  ? _.get(partner, "link.name")
                  : `View Profile ${"➔"}`}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

PartnerCard.propTypes = propTypes;

export default PartnerCard;
