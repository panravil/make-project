import styles from "./AppSlider.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cn from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import Slider from "react-slick";

import NextIcon from "@icons/NextIcon";
import PreviousIcon from "@icons/PreviousIcon";

const propTypes = {
  arrows: PropTypes.bool,
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  darkMode: PropTypes.bool,
  fullWidth: PropTypes.bool,
  slidesToScroll: PropTypes.number,
  slidesToShow: PropTypes.number,
};

// Function to generate slider arrows based on direction
const SliderArrow = ({ onClick, direction }) => {
  return (
    <div
      className={cn(styles.prevArrow)}
      onClick={onClick}
      onKeyPress={onClick}
      role="button"
      tabIndex={0}
    >
      <div
        className={cn(
          styles.iconContainer,
          direction === "right" ? styles.right : styles.left
        )}
      >
        {direction === "right" ? <NextIcon /> : <PreviousIcon />}
      </div>
    </div>
  );
};

// Reusable App slider component
const AppSlider = ({
  arrows,
  children,
  className,
  darkMode,
  fullWidth,
  slidesToScroll = 1,
  slidesToShow = 1,
}) => {
  const length = _.get(children, "length");
  const usedSlidesToScroll = length < slidesToScroll ? length : slidesToScroll;
  const usedSlidesToShow = length < slidesToShow ? length : slidesToShow;
  // Settings passed to the slider
  const settings = {
    dots: true,
    arrows,
    infinite: true,
    slidesToShow: usedSlidesToShow,
    slidesToScroll: usedSlidesToScroll,
    className: cn(
      "app-slider",
      darkMode ? "dark-mode-slider" : "",
      arrows ? "arrows-slider" : "",
      styles.sliderContainer,
      arrows && slidesToShow > 1 ? styles.sliderArrowsContainerPadding : "",
      fullWidth ? styles.fullWidth : "",
      className
    ),
    prevArrow: <SliderArrow direction="left" />,
    nextArrow: <SliderArrow direction="right" />,
    responsive: [
      {
        breakpoint: 1439,
        settings: {
          slidesToShow: usedSlidesToShow >= 4 ? 4 : usedSlidesToShow,
          slidesToScroll: usedSlidesToScroll >= 4 ? 4 : usedSlidesToScroll,
        },
      },
      {
        breakpoint: 1279,
        settings: {
          slidesToShow: usedSlidesToShow >= 3 ? 3 : usedSlidesToShow,
          slidesToScroll: usedSlidesToScroll >= 3 ? 3 : usedSlidesToScroll,
        },
      },
      {
        breakpoint: arrows ? 1023 : 767,
        settings: {
          slidesToShow: usedSlidesToShow >= 2 ? 2 : usedSlidesToShow,
          slidesToScroll: usedSlidesToScroll >= 2 ? 2 : usedSlidesToScroll,
        },
      },
      {
        breakpoint: arrows ? 767 : 511,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return <Slider {...settings}>{children}</Slider>;
};

AppSlider.propTypes = propTypes;

export default AppSlider;
