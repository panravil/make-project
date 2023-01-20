import PropTypes from "prop-types";

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
};

// function to generate links based on props passed in
const AppBasicLink = ({
  link,
  href,
  ariaLabel,
  className,
  onClick,
  children,
  dataRole,
}) => {
  return (
    <a
      href={href || link?.slug}
      className={className}
      data-role={dataRole ? dataRole : link?.dataRole}
      data-cta={link?.dataCta}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children || link?.name}
    </a>
  );
};

AppBasicLink.propTypes = propTypes;

export default AppBasicLink;
