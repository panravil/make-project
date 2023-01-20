import styles from "./Dropdown.module.scss";
import PropTypes from "prop-types";
import cn from "classnames";

const propTypes = {
  name: PropTypes.string,
  option: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  value: PropTypes.string,
  selectOptionHandler: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  textOnly: PropTypes.bool,
};

// Component that handles the styling of the dropdowns
const DropdownOption = ({
  name,
  option,
  value,
  selectOptionHandler,
  children,
  textOnly,
}) => {
  // function that returns the options for the dropdown menu
  // based off of the options array

  if (textOnly) {
    return (
      <div className={cn("caption", styles.customListItem, styles.textOnly)}>
        {children}
      </div>
    );
  }

  return (
    <div
      onClick={() => selectOptionHandler(name, option, value)}
      onKeyPress={() => selectOptionHandler(name, option, value)}
      role="button"
      tabIndex={0}
      className={cn("caption", styles.customListItem)}
    >
      {children}
    </div>
  );
};

DropdownOption.propTypes = propTypes;

export default DropdownOption;
