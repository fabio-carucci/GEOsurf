import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';  // Crea un file Footer.css per lo stile personalizzato

const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <Row>
                    <Col md={4} className="mb-4">
                        <h5>About Us</h5>
                        <p>We are a company dedicated to providing the best services and products to our customers. Our commitment to excellence is unmatched.</p>
                    </Col>
                    <Col md={4} className="mb-4">
                        <h5>Quick Links</h5>
                        <Nav className="flex-column">
                            <Nav.Link href="#home" className="text-white">Home</Nav.Link>
                            <Nav.Link href="#about" className="text-white">About Us</Nav.Link>
                            <Nav.Link href="#services" className="text-white">Services</Nav.Link>
                            <Nav.Link href="#contact" className="text-white">Contact Us</Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={4} className="mb-4">
                        <h5>Contact Us</h5>
                        <p>
                            Via Vittorio Emanuele XXI<br />
                            Alba, CN, 12051, Italia<br />
                            Email: geosurf@administration.it<br />
                            Phone: (+39) 392 7652121
                        </p>
                        <div className="social-icons">
                            <a href="https://facebook.com" className="text-white me-3"><FaFacebook size={24} /></a>
                            <a href="https://twitter.com" className="text-white me-3"><FaTwitter size={24} /></a>
                            <a href="https://instagram.com" className="text-white me-3"><FaInstagram size={24} /></a>
                            <a href="https://linkedin.com" className="text-white me-3"><FaLinkedin size={24} /></a>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <p className="mb-0">© {new Date().getFullYear()} GEOsurf. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
