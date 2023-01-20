import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import _ from "lodash";
import cn from "classnames";
import FacebookCircle from "@icons/FacebookCircle";
import LinkedIn from "@icons/LinkedIn";
import PropTypes from "prop-types";
import styles from "./ShareThisArticle.module.scss";
import Twitter from "@icons/Twitter";

const propTypes = {
  blogFooterData: PropTypes.shape({
    shareTitle: PropTypes.string.isRequired,
  }).isRequired,
};

// Share component for the blog page
const ShareThisArticle = ({ blogFooterData }) => {
  const [shareUrl, setShareUrl] = useState("");

  // Use effect to set the Share Url once the window can recognize the current address
  useEffect(() => {
    if (window) {
      setShareUrl(window.location.href);
    }
  }, []);

  return (
    <div className={cn("container", styles.shareArticleContainer)}>
      <h4>{_.get(blogFooterData, "shareTitle")}</h4>
      <div className={styles.shareIcons}>
        <FacebookShareButton url={shareUrl} resetButtonStyle>
          <div className={styles.shareItem}>
            <div className={styles.iconWrapper}>
              <FacebookCircle />
            </div>
            Facebook
          </div>
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} resetButtonStyle>
          <div className={styles.shareItem}>
            <div className={styles.iconWrapper}>
              <Twitter />
            </div>
            Twitter
          </div>
        </TwitterShareButton>
        <LinkedinShareButton url={shareUrl} resetButtonStyle>
          <div className={styles.shareItem}>
            <div className={styles.iconWrapper}>
              <LinkedIn />
            </div>
            LinkedIn
          </div>
        </LinkedinShareButton>
      </div>
    </div>
  );
};

ShareThisArticle.propTypes = propTypes;

export default ShareThisArticle;
