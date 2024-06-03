import React, { useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './Navbar.css';
import LoginModal from '../login-modal/LoginModal';
import { useAuth } from '../../context/AuthContextProvider';
import logo from '../../assets/placeholderLOGO.jpg'
import NewsModal from '../news-modal/NewsModal';

export default function CustomNavbar() {
    const [modalShow, setModalShow] = useState(false);
    const [newsModalShow, setNewsModalShow] = useState(false);
    const location = useLocation();
    const { isLogged, user, role, logout } = useAuth();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <Navbar expand="lg" className='pt-3 custom-navbar'>
            <Container>
                <Navbar.Brand href="/" className='fw-bold fs-3' style={{color: "rgb(250, 243, 230)"}}>
                    <img
                        src={logo}
                        width="50"
                        height="50"
                        className="d-inline-block align-center"
                        alt="Logo"
                        style={{ borderRadius: "50%", border: "3px solid rgb(250, 243, 230)" }}
                    />{' '}
                    GEOsurf
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" >
                        <Nav.Link href="/" className={`${isActive('/')}`} style={{color: "rgb(250, 243, 230)"}}>Home</Nav.Link>
                        <Nav.Link href="/news" className={`${isActive('/news')}`} style={{color: "rgb(250, 243, 230)"}}>News</Nav.Link>
                    </Nav>
                    {isLogged && (
                        <NavDropdown title={`${user?.nome || ""} ${user?.cognome || ""}`} id="basic-nav-dropdown" align="end" style={{color: "rgb(250, 243, 230)" }}>
                            {role === "company" && <NavDropdown.Item href={`/companyProfile/${user?._id}`}>Profilo</NavDropdown.Item>}
                            {role === "user" && <NavDropdown.Item disabled>{user?.email}</NavDropdown.Item>}
                            {role === "user" && <NavDropdown.Item>Preferiti</NavDropdown.Item>}
                            <NavDropdown.Item href="#action/3.3">Tema</NavDropdown.Item>
                            <NavDropdown.Divider />
                            {user?.role === "admin" && (
                                <>
                                    <NavDropdown.Item className='fw-bold' onClick={() => setNewsModalShow(true)}>Scrivi una news</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                </>
                            )}
                            <NavDropdown.Item className='text-danger fw-bold' onClick={() => logout()}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    )}
                    {!isLogged && <Button variant="outline-light px-4" className="ms-3" onClick={() => setModalShow(true)}>Login</Button>}
                    <LoginModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        dialogClassName="custom-modal"
                    />
                    <NewsModal
                        show={newsModalShow}
                        onHide={() => setNewsModalShow(false)}
                    />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
