import { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import cn from "classnames";
import Close from "@icons/Close";
import PropTypes from "prop-types";

import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  setShowModal: PropTypes.func.isRequired,
  className: PropTypes.string,
  videoPlayer: PropTypes.bool,
  noPadding: PropTypes.bool,
  restrictClose: PropTypes.bool,
  offsetTop: PropTypes.bool,
  setShowParentModal: PropTypes.func,
  forceScroll: PropTypes.bool,
  extraClass: PropTypes.string,
};

const Modal = ({
  children,
  setShowModal,
  className,
  videoPlayer,
  noPadding,
  restrictClose,
  offsetTop,
  setShowParentModal,
  forceScroll,
  extraClass,
}) => {
  // Custom modal component that takes children to
  // populate the internal content

  const ref = useRef();
  const refModal = useRef();
  //body scroll lock to stop user from scrolling while modal is open
  useEffect(() => {
    if (ref.current) {
      disableBodyScroll(ref.current);
    }
    if (refModal.current) {
      disableBodyScroll(refModal.current);
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);

  // function to close the modal
  const closeModal = () => {
    setShowModal(false);
    if (setShowParentModal) {
      setShowParentModal(false);
    }
  };

  const modalProps = {};

  return (
    <div className={styles.modalBackground} ref={ref}>
      <div
        className={cn(
          styles.modal,
          videoPlayer ? styles.videoPlayerModal : "",
          noPadding ? styles.noPadding : "",
          offsetTop ? styles.offsetTop : "",
          className ? className : "",
          forceScroll ? styles.forceScroll : "",
          extraClass ? styles[extraClass] : ""
        )}
        ref={refModal}
        {...modalProps}
      >
        {videoPlayer ? (
          <div className={styles.videoPlayer}>{children}</div>
        ) : (
          children
        )}
        <div
          className={styles.close}
          onClick={closeModal}
          onKeyPress={closeModal}
          role="button"
          tabIndex={0}
          aria-label="close"
        >
          <Close />
        </div>
      </div>
      <div
        className={styles.disabledArea}
        onClick={!restrictClose ? closeModal : null}
        role="none"
      />
    </div>
  );
};

Modal.propTypes = propTypes;

export default Modal;
