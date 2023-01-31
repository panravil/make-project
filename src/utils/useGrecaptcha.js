import { useEffect } from "react";
import loadjs from "loadjs";

export const useGrecaptcha = () => {
  useEffect(() => {
    const scriptSrc = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;

    loadjs(scriptSrc, () => {});

    return () => {
      const head = document.getElementsByTagName("head")[0];
      const body = document.getElementsByTagName("body")[0];
      const gScript = head.querySelector(`script[src="${scriptSrc}"]`);
      const gBadge = body.querySelector("div div.grecaptcha-badge");
      if (gScript) {
        head.removeChild(gScript);
      }
      if (gBadge) {
        gBadge.parentNode.removeChild(gBadge);
      }
    };
  }, []);

  const getGRecaptchaToken = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.grecaptcha !== "undefined") {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
              action: "submit",
            })
            .then((token) => resolve(token))
            .catch((err) => reject(err));
        });
      }
    });
  };

  return getGRecaptchaToken;
};
