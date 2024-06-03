import React, { useEffect, useState } from 'react';
import { Spinner, Alert, Container, Row } from 'react-bootstrap';
import NewsCard from '../../components/news-list/NewsCard';
import NewsPagination from '../../components/news-list/NewsPagination';
import './Newspage.css';

export default function Newspage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [newsPerPage] = useState(10);
    const [totalNews, setTotalNews] = useState(0);
  
    const apiURL = process.env.REACT_APP_API_URL;
  
    useEffect(() => {
      const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${apiURL}/getNews?page=${currentPage}&limit=${newsPerPage}`);
          if (!response.ok) {
            throw new Error('Failed to fetch news');
          }
          const data = await response.json();
          setNews(data.news);
          setTotalNews(data.totalNews);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNews();
    }, [apiURL, currentPage, newsPerPage]);
  
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
      setLoading(true); // Aggiungi questa linea
    };
  
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center mt-4">
          <Spinner animation="border" role="status" />
          <span className='ms-2'>Caricamento in corso...</span>
        </div>
      );
    }
  
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
  
    return (
      <Container>
          <h2 className="title-news">Tutte le news</h2>
          <Row>
              {news.map((singleNews) => (
                  <NewsCard key={singleNews._id} singleNews={singleNews} />
              ))}
          </Row>
          <div className="d-flex justify-content-center mt-3">
              <NewsPagination
                  itemsPerPage={newsPerPage}
                  totalItems={totalNews}
                  paginate={paginate}
                  currentPage={currentPage}
              />
          </div>
      </Container>
    );
}
