import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import './CompanyList.css';
import { Link } from 'react-router-dom';
import HeartButton from './HeartButton'; 
import placeholderLogo from '../../assets/placeholderLOGO.jpg';
import placeholderImage from '../../assets/placeholderCOVER.jpg';
import { useAuth } from '../../context/AuthContextProvider';

function CompanyList({ results, searchPerformed, loading }) {
    const [favorites, setFavorites] = useState([]);
    
    const { user, role } = useAuth();

    const toggleFavorite = (companyId) => {
        if (favorites?.includes(companyId)) {
            setFavorites(favorites?.filter(id => id !== companyId));
        } else {
            setFavorites([...favorites, companyId]);
        }
    };

    useEffect(() => {
        if (role !== "company"){
            setFavorites(user?.preferiti);
        }
    }, [user])

    return (
        <Container className='mt-4'>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" role="status"></Spinner>
                    <span className='ms-2'>Caricamento in corso...</span>
                </div>
            ) : (
                <>
                {searchPerformed && (
                    <p className='text-danger mt-2'>
                        {results.length === 1 ? '1 risultato di ricerca' : `${results.length} risultati di ricerca`}
                    </p>
                )}
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
                                    {user && role !== "company" && <HeartButton 
                                        isFavorite={favorites?.includes(company._id)} 
                                        companyId={company._id} // Passo companyId come prop
                                        toggleFavorite={toggleFavorite} // Passo la funzione di toggle
                                        setFavorites={setFavorites}
                                    />}
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
                </>
            )}
        </Container>
    );
}

export default CompanyList;
