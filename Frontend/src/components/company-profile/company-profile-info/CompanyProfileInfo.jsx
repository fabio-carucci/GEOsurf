import React, { useState } from 'react';
import { Container, Row, Col, Image, Card } from 'react-bootstrap';
import './CompanyProfileInfo.css';

const placeholderImage = 'https://via.placeholder.com/200x150'; // Link to a placeholder image
const placeholderLogo = 'https://via.placeholder.com/60'; // Link to a placeholder logo

const ProfiloCompany = ({company}) => {
    const { nome, email, indirizzo, telefono, logo, cover, websiteURL } = company || {};

    return (
        <Container className="profile-container">
            {company && (
                <Card className="profile-card">
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={6} xl={5} className="profile-image-container">
                                <Image src={logo || placeholderLogo} roundedCircle fluid className="profile-logo" />
                                <Image src={cover || placeholderImage} fluid className="profile-cover" />
                            </Col>
                            <Col xs={12} md={6} xl={7} className='ps-0'>
                                <Card.Text className="profile-title text-uppercase fw-bold ps-0">{nome}</Card.Text>
                                <div className='profile-info-container py-4 py-md-0'>
                                    <Card.Text><strong>Email:</strong> {email}</Card.Text>
                                    <Card.Text>
                                        <strong>Indirizzo: </strong> 
                                        <span>{indirizzo.via}</span>
                                        <span>{indirizzo.CAP} {indirizzo.città}</span><br />
                                        <span>{indirizzo.provincia}, {indirizzo.regione}, {indirizzo.paese}</span>
                                    </Card.Text>
                                    {telefono && <Card.Text><strong>Telefono:</strong> {telefono}</Card.Text>}
                                    {websiteURL && <Card.Text><strong>Sito Web:</strong> <a href={websiteURL} target="_blank" rel="noopener noreferrer">{websiteURL}</a></Card.Text>}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default ProfiloCompany;
