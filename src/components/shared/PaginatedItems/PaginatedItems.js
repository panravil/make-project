import { useState, useEffect } from "react";
import styles from "./PaginatedItems.module.scss";
import cn from "classnames";
import ReactPaginate from "react-paginate";
import JumpToFirst from "@icons/JumpToFirst";
import PreviousIcon from "@icons/PreviousIcon";
import NextIcon from "@icons/NextIcon";
import JumpToLast from "@icons/JumpToLast";
import PropTypes from "prop-types";

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.object.isRequired),
  itemsPerPage: PropTypes.number.isRequired,
  itemOffset: PropTypes.number.isRequired,
  setItemOffset: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  onePage: PropTypes.bool,
  setCurrentItems: PropTypes.func.isRequired,
};

// Component that handles paginating a list of items and
// building the page controls
const PaginatedItems = ({
  items,
  itemsPerPage,
  itemOffset,
  setItemOffset,
  page,
  setPage,
  onePage,
  setCurrentItems,
}) => {
  const [pageCount, setPageCount] = useState(0);
  // determins the items to pull out of the array and display on the page
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(onePage ? 1 : Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  // when clicking on a page to jump to, this handles what items to show
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setPage(event.selected);
  };

  // jumps to the last page
  const jumpToLastPage = () => {
    const newOffset = ((pageCount - 1) * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setPage(pageCount - 1);
  };

  // jumps to the first page
  const jumpToFirstPage = () => {
    setItemOffset(0);
    setPage(0);
  };

  if (pageCount > 1) {
    return (
      <div className={styles.paginatedItems}>
        <div
          className={styles.iconWrapper}
          onClick={jumpToFirstPage}
          onKeyPress={jumpToFirstPage}
          tabIndex={0}
          role="button"
          aria-label="Jump to First Page"
        >
          <JumpToFirst />
        </div>
        <ReactPaginate
          className={styles.reactPaginate}
          pageLinkClassName={styles.pageLinks}
          activeLinkClassName={styles.selectedPage}
          breakClassName={styles.break}
          previousLabel={
            <div className={styles.iconWrapper}>
              <PreviousIcon />
            </div>
          }
          nextLabel={
            <div className={styles.iconWrapper}>
              <NextIcon />
            </div>
          }
          forcePage={page}
          onPageChange={handlePageClick}
          pageRangeDisplayed={page === 1 ? 2 : 3}
          marginPagesDisplayed={0}
          pageCount={pageCount}
        />
        <div
          className={cn(styles.iconWrapper, styles.jumpToLastPage)}
          onClick={jumpToLastPage}
          onKeyPress={jumpToLastPage}
          tabIndex={0}
          role="button"
          aria-label="Jump to Last Page"
        >
          <JumpToLast />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

PaginatedItems.propTypes = propTypes;

export default PaginatedItems;
