import styles from "./BlogHeader.module.scss";

import _ from "lodash";
import cn from "classnames";
import Image from "next/image";
import PropTypes from "prop-types";

import { Link } from "@components/common";

import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoLogoYoutube,
} from "react-icons/io5";

const propTypes = {
  blogData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    readTime: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    image: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    socialLinksCollection: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          dataCta: PropTypes.string.isRequired,
          dataRole: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        })
      ),
    }),
  }),
};

// Blog Header for the blog index page
const BlogHeader = ({ blogData }) => {
  const image = _.get(blogData, "image");
  const datePublished = new Date(blogData.date)
    .toDateString()
    .split(" ")
    .slice(1);
  datePublished[1] = datePublished[1] + ",";
  const formattedDate = datePublished.join(" ");

  const socialLinks = _.get(blogData, "socialLinksCollection.items");

  // Depending on the name of the Social link, Render the different logos
  const renderSocialLinks = socialLinks.map((socialLink, index) => {
    let socialLogo;
    let linkName;
    switch (socialLink.name) {
      case "Facebook":
        socialLogo = <IoLogoFacebook size={20} />;
        linkName = "Facebook";
        break;
      case "LinkedIn":
        socialLogo = <IoLogoLinkedin size={20} />;
        linkName = "LinkedIn";
        break;
      case "Instagram":
        socialLogo = <IoLogoInstagram size={20} />;
        linkName = "Instagram";
        break;
      case "Youtube":
        socialLogo = <IoLogoYoutube size={20} />;
        linkName = "Youtube";
        break;
      case "Twitter":
        socialLogo = <IoLogoTwitter size={20} />;
        linkName = "Twitter";
        break;
    }

    return (
      <Link
        key={index}
        link={socialLink}
        className={cn("secondary", styles.socialIcon)}
        ariaLabel={linkName}
      >
        {socialLogo}
      </Link>
    );
  });

  return (
    <>
      <div className={cn("container", styles.blogDetailsContainer)}>
        <div className={styles.headerContainer}>
          <h1 className={styles.blogTitle}>{blogData.title}</h1>
          <div className={styles.dateAndReadTime}>
            {formattedDate}
            {blogData.readTime
              ? " | " + _.floor(blogData.readTime / 60) + " minutes"
              : null}
          </div>
          {socialLinks?.length > 0 ? (
            <div className={styles.socialContainer}>{renderSocialLinks}</div>
          ) : null}
        </div>
      </div>
      {image && (
        <div className={"container"}>
          <div className={styles.imageContainer}>
            <Image
              src={image.url}
              alt={image.title}
              layout="responsive"
              sizes={"118.4rem"}
              height={(image.height * 1184) / image.width}
              width={1184}
              quality={90}
            />
          </div>
        </div>
      )}
    </>
  );
};

BlogHeader.propTypes = propTypes;

export default BlogHeader;
