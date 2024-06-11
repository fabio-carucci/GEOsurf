import './NotFound.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Pagina non trovata</p>
      <button className="not-found-button" onClick={handleGoHome}>
        Torna alla Homepage
      </button>
    </div>
  );
}
