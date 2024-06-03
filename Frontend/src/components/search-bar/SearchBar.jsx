import React, { useState } from 'react';
import { Container, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import './SearchBar.css';

export default function SearchBar({ onSearchResults, searchPerformed, setSearchPerformed, loading, setLoading }) {
    const [address, setAddress] = useState('');
    const [distance, setDistance] = useState(20);
    const [error, setError] = useState('');

    const apiURL = process.env.REACT_APP_API_URL;

    const getCoordinates = async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
            const data = await response.json();
            if (data.length > 0) {
                const { lat, lon } = data[0];
                return { lat: parseFloat(lat), lon: parseFloat(lon) };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            return null;
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!address) {
            return null;
        };
        setSearchPerformed(true);
        setLoading(true);
        setError('');
        const coords = await getCoordinates(address);
        if (coords) {
            console.log("Coordinates:", coords);
            try {
                const response = await fetch(`${apiURL}/searchCompanies?lat=${coords.lat}&lon=${coords.lon}&radius=${distance}`);
                const data = await response.json();
                console.log("Search results:", data);
                onSearchResults(data);  // Update the parent component with the search results
            } catch (error) {
                console.error("Error fetching search results:", error);
                setError('Errore nel recupero dei risultati di ricerca.');
            }
        } else {
            setError('Indirizzo non trovato. Per favore, inserisci un indirizzo valido.');
        }
        setLoading(false);
        console.log({ address, distance });
    };

    const handleClearFields = () => {
        setAddress('');
        setDistance(20);
        setError('');
    };

    return (
        <div className={`searchbar-container ${searchPerformed ? 'searchbar-reduced' : ''}`}>
            <Container>
                <div className='d-flex align-items-center flex-column'>
                    <h2 className={`searchbar-title ${searchPerformed ? 'searchbar-title-reduced' : ''}`}>
                        Scopri le Migliori Destinazioni per il Surf nel Mondo
                    </h2>
                    <p className={`searchbar-description ${searchPerformed ? 'searchbar-description-reduced' : ''}`}>
                        Benvenuto su GEOsurf, il tuo punto di riferimento per trovare le destinazioni perfette per il surf. Che tu sia un principiante o un surfista esperto, il nostro sito ti aiuterà a scoprire i luoghi più affascinanti e le onde più entusiasmanti. 
                        <br/>Inserisci la posizione che preferisci, seleziona la distanza e trova il prossimo spot da esplorare!
                    </p>
                </div>
                <Form onSubmit={handleSearch}>
                    <div className='d-flex justify-content-center'>
                        <InputGroup className="mb-3 input-group-custom" style={{ width: "80%" }}>
                            <Form.Control
                                type="text" 
                                placeholder="Inserisci l'indirizzo che preferisci" 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="custom-input"
                                style={{ paddingRight: address ? '30px' : '8px' }} // Aggiungi spazio per la X
                            />
                            {address && (
                                <AiOutlineCloseCircle 
                                    className="clear-icon fs-5"
                                    onClick={handleClearFields}
                                />
                            )}
                            <Button  
                                type="submit"
                                className="custom-button"
                                disabled={loading}
                            >
                                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Cerca'}
                            </Button>
                        </InputGroup>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <Form.Group controlId="distance" className="d-flex align-items-center ms-lg-3 flex-column flex-lg-row" style={{width: "70%"}}>
                            <Form.Label className="mb-3 mb-lg-1 mr-2 flex-shrink-0" style={{ minWidth: '150px', color:"rgb(250, 243, 230)" }}>
                                Raggio di {distance} Km
                            </Form.Label>
                            <Form.Control 
                                type="range" 
                                min="20" 
                                max="200" 
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="custom-range flex-grow-1 mb-3 mb-lg-1"
                            />
                        </Form.Group>
                    </div>
                </Form>
                {error && (
                    <Alert variant="danger" className="mt-3">
                        {error}
                    </Alert>
                )}
            </Container>
        </div>
    );
}