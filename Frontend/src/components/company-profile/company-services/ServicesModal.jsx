import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const ServicesModal = ({ show, handleClose, handleSave, currentServices, allServices, loading, error }) => {
    const [selectedServices, setSelectedServices] = useState(currentServices);

    const handleCheckboxChange = (service) => {
        if (selectedServices.includes(service)) {
            setSelectedServices(selectedServices.filter(item => item !== service));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modifica Servizi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {allServices.map((service, index) => (
                        <Form.Check
                            key={index}
                            type="checkbox"
                            label={service}
                            checked={selectedServices.includes(service)}
                            onChange={() => handleCheckboxChange(service)}
                        />
                    ))}
                </Form>
                {error && <p className="text-danger mt-2">{error}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                    Chiudi
                </Button>
                <Button variant="outline-primary" onClick={() => handleSave(selectedServices)} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Salva modifiche'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ServicesModal;
