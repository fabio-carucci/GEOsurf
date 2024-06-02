import React, { useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import './Navbar.css';
import LoginModal from '../login-modal/LoginModal';
import { useAuth } from '../../context/AuthContextProvider';
import logo from '../../assets/placeholderLOGO.jpg'

export default function CustomNavbar() {

    const [modalShow, setModalShow] = useState(false);

    const { isLogged, user, role, logout } = useAuth();

    return (
        <Navbar expand="lg" className='py-3 custom-navbar'>
            <Container>
                <Navbar.Brand href="#home">
                    <img
                    src={logo}
                    width="50"
                    height="50"
                    className="d-inline-block align-top"
                    alt="Logo"
                    style={{borderRadius: "50%", border: "3px solid white"}}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/" className='text-light'>Home</Nav.Link>
                        <Nav.Link href="#link" className='text-light'>Link</Nav.Link>
                    </Nav>
                    {isLogged && <NavDropdown title={`${user?.nome || ""} ${user?.cognome || ""}`} id="basic-nav-dropdown" align="end" style={{color: "white"}}>
                        {role === "company" && <NavDropdown.Item href={`/companyProfile/${user?._id}`}>Profilo</NavDropdown.Item>}
                        {role === "user" && <NavDropdown.Item disabled>{user?.email}</NavDropdown.Item>}
                        {role === "user" && <NavDropdown.Item>Preferiti</NavDropdown.Item>}
                        <NavDropdown.Item href="#action/3.3">Tema</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item className='text-danger fw-bold' onClick={() => logout()}>Logout</NavDropdown.Item>
                    </NavDropdown>}
                    {!isLogged && <Button variant="outline-light px-4" className="ms-3" onClick={() => setModalShow(true)}>Login</Button>}
                    <LoginModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        dialogClassName="custom-modal"
                    />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}