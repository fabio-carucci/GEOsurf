import React, { useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import './Navbar.css';
import LoginModal from '../login-modal/LoginModal';
import { useAuth } from '../../context/AuthContextProvider';

export default function CustomNavbar() {

    const [modalShow, setModalShow] = useState(false);

    const { isLogged, user, role, logout } = useAuth();

    return (
        <Container bg="light">
            <Navbar expand="lg" className='py-3'>
                <Navbar.Brand href="#home">
                    <img
                    src="#"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="Logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                    </Nav>
                    {isLogged && <NavDropdown title={user?.nome} id="basic-nav-dropdown" align="end">
                        <NavDropdown.Item href="#action/3.1">Profilo</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Preferiti</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Tema</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item className='text-danger fw-bold' onClick={() => logout()}>Logout</NavDropdown.Item>
                    </NavDropdown>}
                    {!isLogged && <Button variant="outline-success px-4" className="ms-3" onClick={() => setModalShow(true)}>Login</Button>}
                    <LoginModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        dialogClassName="modal-40w"
                    />
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );
}