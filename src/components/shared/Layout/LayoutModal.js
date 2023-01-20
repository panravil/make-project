import styles from "./LayoutModal.module.scss";
import { Link } from "@components/common";
import PropTypes from "prop-types";
import cn from "classnames";
import Image from "next/image";

import { AppIcon } from "@components/shared";

const propTypes = {
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  setShowLoginHover: PropTypes.func,
  heading: PropTypes.string,
  image: PropTypes.shape({
    height: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  }),
  text: PropTypes.string,
  link: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
};

// Component that returns the App details styled as a card with a link to specific app
const LayoutModal = ({
  showModal,
  setShowModal,
  setShowLoginHover,
  heading,
  image,
  text,
  link,
}) => {
  /*const appLink = {
    name: app.name,
    slug: href ? href : `/integrations/${app.slug}`,
  };*/

  const handleClose = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const handleCloseAndShowMiracle = (e) => {
    e.preventDefault();
    setShowModal(false);
    setShowLoginHover(true);
  };

  return (
    <div className={styles.layoutModal}>
      <div className={styles.imageContainer}>
        <Image
          src={image.url}
          alt={image.title}
          layout="fill"
          className={styles.headerImage}
          /*objectFit='cover'*/
          quality={100}
        />
      </div>
      <div className={styles.headerContainer}>{heading}</div>
      <div className={styles.content}>
        <p>
          You can still access your Legacy (Integromat) account through the{" "}
          <a href={"/"} onClick={handleCloseAndShowMiracle}>
            Sign&nbsp;in
          </a>{" "}
          button on{" "}
          <a href={"/"} onClick={handleClose}>
            make.com
          </a>
          .
        </p>
        <p>
          Not a user yet? Create a Make account and{" "}
          <a href={"/en/register"}>get&nbsp;started&nbsp;for&nbsp;free</a>!
        </p>
        <button className={cn("button gradient")} onClick={handleClose}>
          {link?.name}
        </button>
      </div>
    </div>
  );
};

LayoutModal.propTypes = propTypes;

export default LayoutModal;
