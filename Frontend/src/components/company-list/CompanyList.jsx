import React from 'react';
import { Container, Row, Col, Card, Placeholder, Spinner } from 'react-bootstrap';
import './CompanyList.css';
import { Link } from 'react-router-dom';
import placeholderLogo from '../../assets/placeholderLOGO.jpg';
import placeholderImage from '../../assets/placeholderCOVER.jpg';

function CompanyList({ results, searchPerformed, loading }) {
    return (
        <Container className='mt-4'>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" role="status"></Spinner>
                    <span className='ms-2'>Caricamento in corso...</span>
                </div>
            ) : searchPerformed && results.length === 0 ? (
                <p className='text-danger mt-2'>Non sono stati trovati risultati per la tua ricerca.</p>
            ) : (
                <Row>
                    {results.map((company, index) => (
                        <Col lg={4} md={6} sm={12} key={index} className="mb-4">
                            <Card className="company-card">
                                <div className="card-img-container">
                                    <Card.Img 
                                        variant="top" 
                                        src={company.cover || placeholderImage} 
                                        alt={company.nome} 
                                        className="card-img"
                                    />
                                    <div className="card-logo-container">
                                        <img 
                                            src={company.logo || placeholderLogo} 
                                            alt={`${company.nome} logo`} 
                                            className="card-logo"
                                        />
                                    </div>
                                </div>
                                <Card.Body className='text-center'>
                                    <Card.Title as={Link} target='_blank' to={`/companyProfile/${company._id}`} className="text-center">{company.nome}</Card.Title>
                                    <Card.Text className="text-center">
                                        {company.indirizzo.via}, {company.indirizzo.città}, {company.indirizzo.paese}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default CompanyList;