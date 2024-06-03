import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContextProvider';

export default function NewsModal({ show, onHide }) {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { token } = useAuth();

    useEffect(() => {
        // Clear fields when modal is shown
        if (show === true) {
            setTitle('');
            setText('');
        }
    }, [show]);

    const apiURL = process.env.REACT_APP_API_URL;

    const handleSave = async () => {
        if (!title || !text) {
            setError('Tutti i campi sono obbligatori');
            return;
        }

        const confirmSend = window.confirm("Confermi l'invio di questa news?");
        if (!confirmSend) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${apiURL}/news/createNews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    body: text
                })
            });

            if (!response.ok) {
                throw new Error('Errore durante il salvataggio della news');
            }

            const data = await response.json();
            console.log(data);

            onHide();
            window.location.reload();
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        const confirmClose = window.confirm("Stai per chiudere il form, perderai le tue attuali modifiche. Sei sicuro?");
        if (confirmClose) onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Scrivi una News</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group controlId="formTitle">
                        <Form.Label>Titolo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Inserisci il titolo"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formText" className="mt-3">
                        <Form.Label>Testo</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Inserisci il testo della news"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={2000}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} variant="secondary">Chiudi</Button>
                <Button onClick={handleSave} variant="primary" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Salva'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}