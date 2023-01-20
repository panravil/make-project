import styles from "./ShareDrawer.module.scss";
import { Drawer } from "@components/common";

import Email from "@icons/Email";
import Twitter from "@icons/Twitter";
import FacebookCircle from "@icons/FacebookCircle";
import ShareIcon from "@icons/ShareIcon";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
} from "react-share";
import { useEffect, useState } from "react";

// Drawer component for share options (email fb twitter) that
// links out to the proper place with the url of the page
// already saved in the body of the message
const ShareDrawer = () => {
  const [href, setHref] = useState(``);
  useEffect(() => {
    setHref(window.location);
  });
  return (
    <>
      <div className={styles.shareLabel}>
        <div
          className={styles.openShareDrawer}
          role="button"
          tabIndex={0}
          aria-label="Open Share Drawer"
        >
          <div className={styles.shareIcon}>
            <ShareIcon />
          </div>
          Share
        </div>
        <Drawer>
          <div className={styles.shareLinks}>
            {/* Share to Email button with link to current URL */}
            <EmailShareButton url={href} resetButtonStyle>
              <div className={styles.drawerItem}>
                <div className={styles.iconWrapper}>
                  <Email />
                </div>
                Email
              </div>
            </EmailShareButton>
            {/* Share to Twitter button with link to current URL */}
            <TwitterShareButton url={href} resetButtonStyle>
              <div className={styles.drawerItem}>
                <div className={styles.iconWrapper}>
                  <Twitter />
                </div>
                Twitter
              </div>
            </TwitterShareButton>
            {/* Share to Facebook button with link to current URL */}
            <FacebookShareButton url={href} resetButtonStyle>
              <div className={styles.drawerItem}>
                <div className={styles.iconWrapper}>
                  <FacebookCircle />
                </div>
                Facebook
              </div>
            </FacebookShareButton>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default ShareDrawer;
