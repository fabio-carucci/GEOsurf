import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContextProvider';


export default function LoginForm({onHide}) {
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
        // Determina l'endpoint in base al ruolo dell'utente
        const isCompany = formData.get('isCompany') === 'on'; // Verifica se il checkbox è selezionato
        const endpoint = isCompany ? `${apiURL}/auth/loginCompany` : `${apiURL}/auth/loginUser`;

        // Invia una richiesta POST al server con i dati del form
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData, // Usa FormData come body della richiesta
        });

        // Parsea la risposta JSON
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            // Gestisce il login avvenuto con successo
            console.log('Login successful', data.token);
            onHide(); // Chiude il modale al successo del login
            login(data.token, isCompany ? 'company' : 'user');
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

            <Form.Group controlId="formBasicPassword" className='mt-2'>
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                required
            />
            </Form.Group>

            <Form.Group controlId="formBasicCheckbox" className='mt-2'>
            <Form.Check 
                type="checkbox"
                name="isCompany"
                id="isCompany"
                label="sono un'azienda"
            />
            </Form.Group>

            {/* Bottone per effettuare il login */}
            <div className="text-center">
            <Button variant="outline-primary" className="mt-2 px-4" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
            </Button>
            </div>

            {/* Mostra un messaggio di errore se presente */}
            {error && <p className="text-danger mt-2">{error}</p>}
        </Form>
    )
}
