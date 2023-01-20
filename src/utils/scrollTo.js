/**
 * If document exists attempt to grab element
 * If element exists, scroll to top of the element
 * accounting for the navbar height & a passed in offset.
 * @param {string} elementId - The id of the element to scroll to.
 * @param {number} offset - Offset from top of element to scroll to.
 */

export default function scrollTo(elementId, offset = 0) {
  if (document) {
    const element = document.getElementById(elementId);
    if (element) {
      const boundingClientRect = element.getBoundingClientRect();
      const offsetTop = boundingClientRect.top;
      const windowScrollY = window.scrollY;
      window.scrollTo({
        top: windowScrollY + offsetTop - 113 + offset,
        behavior: "smooth",
      });
    }
  }
}
