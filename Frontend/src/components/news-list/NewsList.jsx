import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert, Container, Row, Col, Button } from 'react-bootstrap';
import './NewsList.css';

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedNews, setExpandedNews] = useState({});

  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${apiURL}/getNews`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data.news);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [apiURL]);

  const toggleExpand = (id) => {
    setExpandedNews((prevExpandedNews) => ({
      ...prevExpandedNews,
      [id]: !prevExpandedNews[id]
    }));
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
      <h2 className='title-news'>Ultime news</h2>
      <Row>
        {news.map((item) => (
          <Col key={item._id} xs={12} className="mb-4">
            <Card className='custom-newslist-card'>
              <Card.Body className='pt-4'>
                <Card.Title><strong>{item.title}</strong></Card.Title>
                <Card.Text className='card-news-text'>
                  {expandedNews[item._id] ? item.body : item.body.length > 450 ? `${item.body.slice(0, 450)}...` : item.body}
                  {item.body.length > 450 && (
                    <Button variant="link" onClick={() => toggleExpand(item._id)}>
                      {expandedNews[item._id] ? 'Leggi meno' : 'Leggi di più'}
                    </Button>
                  )}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="custom-newslist-footer">
                <span>{item.author.nome} {item.author.cognome}</span>
                <span>Aggiunto il {new Date(item.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
