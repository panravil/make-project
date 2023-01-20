import { useState, useEffect } from "react";

/**
 * Function that reads the window width with internal delays
 * @param {number} time - length of delay if provided, otherwise defaults to 100ms
 */
function getWindowWidth(time) {
  const isBrowser = typeof window !== "undefined";
  const [width, setWidth] = useState(isBrowser ? window.innerWidth : 0);

  // delay how often this function can be ran
  function debounce(func, ms) {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(this, arguments);
      }, ms);
    };
  }

  // useEffect to listen to page being resized to trigger different renders
  useEffect(() => {
    if (!isBrowser) {
      return false;
    }

    const debouncedHandleResize = debounce(function handleResize() {
      setWidth(window.innerWidth);
    }, time || 100);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  return width;
}

export default getWindowWidth;
