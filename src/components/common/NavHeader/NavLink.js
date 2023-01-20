import Link from "next/link";
import PropTypes from "prop-types";
import helpers from "@utils/helpers";

const propTypes = {
  dataRole: PropTypes.string,
  dataCta: PropTypes.string,
  className: PropTypes.string,
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
const NavLink = ({
  dataRole,
  dataCta,
  href,
  className,
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

  if (external) {
    return (
      <a
        href={href}
        className={className}
        data-role={dataRole}
        data-cta={dataCta}
      >
        {children}
      </a>
    );
  } else {
    href = helpers.addLangToLink(href);
  }

  if (!prefetch) {
    addProps.prefetch = false;
  }

  return (
    <Link href={href} {...addProps}>
      <a
        href={href}
        className={className}
        data-role={dataRole}
        data-cta={dataCta}
      >
        {children}
      </a>
    </Link>
  );
};

NavLink.propTypes = propTypes;

export default NavLink;
