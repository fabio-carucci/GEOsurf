import React, { useState } from 'react';
import { Card, Modal, Form, Button, Spinner } from 'react-bootstrap';
import { FaRegStar, FaStar, FaPenToSquare, FaTrash } from "react-icons/fa6";
import { useAuth } from '../../../context/AuthContextProvider';

const StarRating = ({ value = 0, onChange = () => {} }) => {
    const [hoverValue, setHoverValue] = useState(undefined);
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div>
            {stars.map(star => (
                <span
                    key={star}
                    onClick={() => onChange(star === value ? 0 : star)}
                    onMouseEnter={() => setHoverValue(star)}
                    onMouseLeave={() => setHoverValue(undefined)}
                    style={{ cursor: 'pointer', fontSize: 30 }}
                    className='text-warning'
                >
                    {star <= (hoverValue || value) ? <FaStar /> : <FaRegStar />}
                </span>
            ))}
        </div>
    );
};

const ReviewCard = ({ review, updateReview, deleteReview, handleShowToastMessage }) => {
    const { user, token } = useAuth();
    const apiURL = process.env.REACT_APP_API_URL;

    const [showEditModal, setShowEditModal] = useState(false);
    const [editStars, setEditStars] = useState(review.stars);
    const [editComment, setEditComment] = useState(review.comment);
    const [updatingReview, setUpdatingReview] = useState(false);

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleSaveEdit = async () => {
        const confirmEdit = window.confirm("Vuoi salvare le modifiche a questa recensione?");
        if (confirmEdit) {
            try {
                setUpdatingReview(true);
                const response = await fetch(`${apiURL}/updateReview/${review._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ stars: editStars, comment: editComment })
                });
                if (!response.ok) {
                    throw new Error('Errore durante la modifica della recensione.');
                }
                const data = await response.json();
                updateReview(data);
                handleCloseEditModal();
                handleShowToastMessage("success", "La tua recensione è stata aggiornata.");
            } catch (err) {
                console.error(err.message);
                handleShowToastMessage("danger", "Errore durante la modifica della recensione.");
            } finally {
                setUpdatingReview(false);
            }
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Sei sicuro di voler eliminare questa recensione?");
        if (confirmDelete) {
            try {
                const response = await fetch(`${apiURL}/deleteReview/${review._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Errore durante l\'eliminazione della recensione.');
                }
                deleteReview(review._id); // Aggiorna la lista delle recensioni dopo la cancellazione
                handleShowToastMessage("danger", "La tua recensione è stata cancellata.");
            } catch (err) {
                console.error(err.message);
                handleShowToastMessage("danger", "Errore durante l'eliminazione della recensione.");
            }
        }
    };

    return (
        <>
            <Card className='card-review position-relative'>
                <Card.Body className='py-4'>
                    <Card.Title className='mb-0'>
                        {review.author.nome} {review.author.cognome}
                    </Card.Title>
                    <div className='d-flex align-items-end'>
                        <div>
                            {Array(review.stars).fill().map((_, i) => (
                                <FaStar key={i} size={20} className="text-warning" />
                            ))}
                            {Array(5 - review.stars).fill().map((_, i) => (
                                <FaRegStar key={i} size={20} className="text-warning" />
                            ))}
                        </div>
                        <div className="ms-2 text-secondary" style={{ fontSize: '10pt' }}>
                            {new Date(review.createdAt).toLocaleDateString('it-IT')}
                        </div>
                    </div>
                    <Card.Text className='mt-3'>{review.comment}</Card.Text>
                </Card.Body>
                {user && review.author._id === user._id && (
                    <div className="icon-container">
                        <FaPenToSquare className="icon text-warning" onClick={handleEdit} />
                        <FaTrash className="icon text-danger" onClick={handleDelete} />
                    </div>
                )}
            </Card>

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica Recensione</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editStars">
                            <Form.Label>Valutazione</Form.Label>
                            <StarRating value={editStars} onChange={(newRating) => setEditStars(newRating)} />
                        </Form.Group>
                        <Form.Group controlId="editComment">
                            <Form.Label>Commento</Form.Label>
                            <Form.Control as="textarea" rows={3} value={editComment} onChange={(e) => setEditComment(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Chiudi
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit} disabled={updatingReview}>
                        {updatingReview ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Salva modifiche'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ReviewCard;
