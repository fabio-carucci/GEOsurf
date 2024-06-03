import React from 'react';
import { Card, Col } from 'react-bootstrap';

const NewsCard = ({ singleNews }) => {
  return (
    <Col xs={12} className='mb-4'>
      <Card className='custom-newslist-card'>
        <Card.Body>
          <Card.Title className='mb-4'>{singleNews.title}</Card.Title>
          <Card.Text style={{fontSize: "1rem"}}><em>{singleNews.body}</em></Card.Text>
        </Card.Body>
        <Card.Footer className="custom-newslist-footer mt-4" style={{fontSize: "1rem"}}>
          <small>{`${singleNews.author.nome} ${singleNews.author.cognome}`}</small>
          <small>{new Date(singleNews.createdAt).toLocaleDateString('it-IT')}</small>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default NewsCard;