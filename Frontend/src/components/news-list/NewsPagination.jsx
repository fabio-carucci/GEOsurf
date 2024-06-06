import React from 'react';
import { Pagination } from 'react-bootstrap';
import './NewsPagination.css'; // Assicurati che il file CSS sia importato

const NewsPagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination>
      <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} className="custom-pagination" />
      <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="custom-pagination" />
      {pageNumbers.map(number => (
        <Pagination.Item
          key={number}
          active={currentPage === number}
          onClick={() => paginate(number)}
          className="custom-pagination"
        >
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length} className="custom-pagination" />
      <Pagination.Last onClick={() => paginate(pageNumbers.length)} disabled={currentPage === pageNumbers.length} className="custom-pagination" />
    </Pagination>
  );
};

export default NewsPagination;
