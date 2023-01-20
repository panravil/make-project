import Link from "next/link";
import PropTypes from "prop-types";
import helpers from "@utils/helpers";

const propTypes = {
  link: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    dataRole: PropTypes.string,
    dataCta: PropTypes.string,
  }).isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array,
  ]),
  prefetch: PropTypes.bool,
  external: PropTypes.bool,
};

// function to generate links based on props passed in
const AppLink = ({
  link,
  href,
  ariaLabel,
  className,
  onClick,
  children,
  prefetch,
  external,
}) => {
  if (typeof prefetch === "undefined") {
    prefetch = true;
  }
  if (typeof external === "undefined") {
    external = false;
  }

  const addProps = {};

  let linkHref = href || link?.slug;

  if (external || link?.external) {
    return (
      <a
        href={linkHref}
        className={className}
        data-role={link?.dataRole}
        data-cta={link?.dataCta}
        aria-label={ariaLabel}
      >
        {children || link?.name}
      </a>
    );
  } else {
    // link is not external
    linkHref = helpers.addLangToLink(linkHref);
  }

  if (!prefetch) {
    addProps.prefetch = false;
  }

  return (
    <Link href={linkHref} {...addProps}>
      <a
        href={linkHref}
        onClick={onClick}
        onKeyPress={onClick}
        className={className}
        data-role={link?.dataRole}
        data-cta={link?.dataCta}
        aria-label={ariaLabel}
      >
        {children || link?.name}
      </a>
    </Link>
  );
};

AppLink.propTypes = propTypes;

export default AppLink;
