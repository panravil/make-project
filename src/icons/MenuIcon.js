import PropTypes from "prop-types";
const propTypes = {
  navbarOpen: PropTypes.bool.isRequired,
};

export default function MenuIcon({ navbarOpen }) {
  return (
    <svg
      role="none"
      width="100%"
      height="100%"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/*<g filter="url(#filter0_b_5_13078)">*/}
      <path
        d="M0 28C0 12.536 12.536 0 28 0V0C43.464 0 56 12.536 56 28V28C56 43.464 43.464 56 28 56V56C12.536 56 0 43.464 0 28V28Z"
        fill="currentColor"
      />
      {navbarOpen ? (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.6265 19.9193C20.4312 19.724 20.1147 19.724 19.9194 19.9193C19.7241 20.1145 19.7241 20.4311 19.9194 20.6264L28.2931 29.0001L19.9194 37.3738C19.7241 37.5691 19.7241 37.8857 19.9194 38.0809C20.1147 38.2762 20.4312 38.2762 20.6265 38.0809L29.0002 29.7072L37.3738 38.0808C37.569 38.276 37.8856 38.276 38.0809 38.0808C38.2761 37.8855 38.2761 37.5689 38.0809 37.3736L29.7073 29.0001L38.0809 20.6265C38.2761 20.4313 38.2761 20.1147 38.0809 19.9194C37.8856 19.7242 37.569 19.7242 37.3738 19.9194L29.0002 28.293L20.6265 19.9193Z"
          fill="white"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27.9092 21.3636H21.3638V27.9091H27.9092V21.3636ZM27.9092 30.0909H21.3638V36.6364H27.9092V30.0909ZM28.8931 32.1657L34.5616 28.8929L37.8343 34.5615L32.1658 37.8342L28.8931 32.1657ZM36.6365 21.3636H30.091V27.9091H36.6365V21.3636Z"
          fill="white"
        />
      )}
      {/*</g>*/}
      {/*}<defs>
        <filter
          id="filter0_b_5_13078"
          x="-100"
          y="-100"
          width="256"
          height="256"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="50" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_5_13078"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_5_13078"
            result="shape"
          />
        </filter>
      </defs>*/}
    </svg>
  );
}

MenuIcon.propTypes = propTypes;
