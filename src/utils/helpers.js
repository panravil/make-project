export default {
  addLangToLink: (link) => {
    // @TODO in the future, there can be more languages
    if (
      link &&
      !link.startsWith("/en/") &&
      !link.startsWith("en/") &&
      !link.startsWith("http") &&
      !link.startsWith("www.") &&
      !link.startsWith("#") &&
      !link.startsWith("mailto:")
    ) {
      if (link.charAt(0) === "/") {
        link = link.substring(1);
      }
      link = "/en/" + link;
    }
    return link;
  },
};
