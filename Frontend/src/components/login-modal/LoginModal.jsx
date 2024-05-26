import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import './LoginModal.css';
import { useAuth } from '../../context/AuthContextProvider';

export default function LoginModal(props) {
  // Stati per gestire errori e caricamento
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const apiURL = process.env.REACT_APP_API_URL;

  // Funzione per gestire la sottomissione del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crea un oggetto FormData con i dati del form
    const formData = new FormData(e.target);

    // Resetta gli errori e imposta lo stato di caricamento
    setError('');
    setLoading(true);

    try {
      // Invia una richiesta POST al server con i dati del form
      const response = await fetch(`${apiURL}/auth/loginUser`, {
        method: 'POST',
        body: formData, // Usa FormData come body della richiesta
      });

      // Parsea la risposta JSON
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Gestisce il login avvenuto con successo
        console.log('Login successful', data.token);
        props.onHide(); // Chiude il modale al successo del login
        login(data.token, "user");
      } else {
        // Gestisce gli errori di login
        setError(data.message || 'Errore di login');
      }
    } catch (error) {
      // Gestisce gli errori di connessione
      setLoading(false);
      setError('Errore di connessione al server');
      console.error('Error during fetch:', error);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Accedi
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Form per l'email e la password */}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Inserisci email"
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </Form.Group>

          {/* Bottone per effettuare il login */}
          <div className="text-center">
            <Button variant="outline-primary" className="mt-3 px-4" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
          </div>

          {/* Mostra un messaggio di errore se presente */}
          {error && <p className="text-danger mt-2">{error}</p>}
        </Form>

        {/* Link per la registrazione */}
        <div className="text-center mt-2">
          Non hai un account? <a className='text-danger' href="#register">Registrati</a>
        </div>

        {/* Divisore orizzontale con testo "oppure" */}
        <div className="hr-container">
          <span>oppure</span>
          <hr />
        </div>

        {/* Bottone per il login con Google */}
        <div className="text-center">
          <Button variant="outline-danger" className="mt-2 px-4">Accedi con Google</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Chiudi</Button>
      </Modal.Footer>
    </Modal>
  );
}