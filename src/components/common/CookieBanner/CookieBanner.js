import styles from "./CookieBanner.module.scss";
import { useRouter } from "next/router";
import cn from "classnames";
import CookieConsent from "react-cookie-consent";

// https://www.npmjs.com/package/react-cookie-consent

const CookieBanner = () => {
  const router = useRouter();
  return (
    <CookieConsent
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      disableStyles={true}
      onDecline={() => router.push("https://google.com")}
      containerClasses={cn("container", styles.cookieConsentContainer)}
      buttonWrapperClasses={styles.cookieConsentButtonWrapper}
      buttonClasses={styles.cookieConsentButton}
      declineButtonClasses={cn("secondary", styles.cookieConsentDeclineButton)}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  );
};

export default CookieBanner;
