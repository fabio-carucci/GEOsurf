import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export default function SessionExpirationAlert({ logout, role, token, setToken, setSessionExpired, setIsSessionExpired }) {
    const [countdown, setCountdown] = useState(30); // Tempo in secondi per il countdown

    // Funzione per chiudere il modal
    const handleClose = () => setSessionExpired(false);

    const apiURL = process.env.REACT_APP_API_URL;

    const refreshToken = async () => {
        const endpoint = role === "user" ? "/user/refreshUserToken" : "/company/refreshCompanyToken";

        try {
            const response = await fetch(`${apiURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Errore durante l\'aggiornamento del token');
            }

            const data = await response.json();
            const { token: newToken } = data;

            setToken(newToken);
            localStorage.setItem('token', newToken);
            setSessionExpired(false);
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del token:', error.message);
        }
    };


    // Funzione per gestire il countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Effetto per chiudere il modal quando il countdown raggiunge 0
    useEffect(() => {
        if (countdown === 0) {
        localStorage.setItem("isSessionExpired", true); // Salva sessionExpired nel localStorage 
        setIsSessionExpired(true);
        
        handleClose(); // Chiudi il modal
        logout(); // Effettua il logout
        }
    }, [countdown, logout]);

    // Funzione per gestire il click su "Rimani loggato"
    const handleStayLoggedIn = async () => {
        await refreshToken();
        handleClose();
    };

    return (
        <Modal show={true} onHide={handleClose} backdrop="static">
        <Modal.Header >
            <Modal.Title>Sessione inattiva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            La tua sessione sta per scadere. Rimani loggato?
            <br />
            Timer: {countdown} secondi
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleStayLoggedIn}>
                Rimani loggato
            </Button>
            <Button variant="primary" onClick={() => { logout(); handleClose(); }}>
                Effettua il logout
            </Button>
        </Modal.Footer>
        </Modal>
    );
}