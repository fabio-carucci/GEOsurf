import React, { useEffect } from 'react';
import { Toast } from 'react-bootstrap';

const ToastMessage = ({ message, type, onClose, show }) => {
  // Definire il colore del toast in base al tipo
  const toastColor = type === 'success' ? 'bg-success' : 'bg-danger';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 15000); // Chiudi il toast dopo 15 secondi

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Toast
      onClose={onClose}
      show={show}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        minWidth: '250px',
        maxWidth: '300px',
        zIndex: '1050',
      }}
    >
      <Toast.Header closeButton={true} className={`text-white ${toastColor}`}>
        <strong className="me-auto">Notifica</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default ToastMessage;