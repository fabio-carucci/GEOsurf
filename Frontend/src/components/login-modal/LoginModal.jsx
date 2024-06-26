import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './LoginModal.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import GoogleLoginButton from './GoogleLoginButton';

export default function LoginModal(props) {
  const [isRegistering, setIsRegistering] = useState(false);

  // Funzione per chiudere il modal e resettare lo stato di registrazione
  const handleClose = () => {
    props.onHide();
    setIsRegistering(false);
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose} // Usa la nuova funzione handleClose
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {!isRegistering ? "Accedi" : "Registrati"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Form differente se sta facendo il login o il signup */}
        {!isRegistering && <LoginForm onHide={handleClose} />}
        {isRegistering && <RegisterForm onHide={handleClose} setIsRegistering={() => setIsRegistering(false)} />}

        {/* Link per la registrazione */}
        <div className="text-center mt-2">
          {!isRegistering ? "Non hai un account?" : "Hai già un account?"} <a className='text-danger' id='register-button' onClick={() => setIsRegistering(!isRegistering)}>{!isRegistering ? "Registrati" : "Accedi"}</a>
        </div>

        {/* Divisore orizzontale con testo "oppure" */}
        {!isRegistering &&
          <div className="hr-container">
            <span>oppure</span>
            <hr />
          </div>}

        {/* Bottone per il login con Google */}
        {!isRegistering &&
          <div className="text-center">
            <GoogleLoginButton />
          </div>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Chiudi</Button>
      </Modal.Footer>
    </Modal>
  );
}
