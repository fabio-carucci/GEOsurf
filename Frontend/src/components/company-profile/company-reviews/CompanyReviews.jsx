import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Button, Modal } from 'react-bootstrap';
import { FaRegStar, FaStar } from "react-icons/fa6";
import { useAuth } from '../../../context/AuthContextProvider';
import './CompanyReviews.css';
import ToastMessage from '../../general-toast-message/ToastMessage';
import ReviewList from './ReviewList';

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

const CompanyReviews = ({ companyId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState('');
    const [sendingReview, setSendingReview] = useState(false);
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [showToastMessage, setShowToastMessage] = useState(false);

    const [toastMessageText, setToastMessageText] = useState("");
    const [toastMessageType, setToastMessageType] = useState("");

    const { user, token } = useAuth();

    const apiURL = process.env.REACT_APP_API_URL;

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${apiURL}/reviews/${companyId}`);
            if (!response.ok) {
                throw new Error('Errore durante il recupero delle recensioni.');
            }
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [companyId]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setShowLoginAlert(true);
            return;
        }

        if (stars === 0 || comment.trim() === '') {
            setError('Devi inserire un voto e un commento prima di inviare la recensione.');
            return;
        }

        const reviewData = { stars, comment, companyId };
        const confirmReview = window.confirm("Vuoi inviare questa recensione?");
        if (confirmReview) {
            try {
                setSendingReview(true);
                const response = await fetch(`${apiURL}/createReview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reviewData)
                });
                if (!response.ok) {
                    throw new Error('Errore durante l\'invio della recensione.');
                }
                const data = await response.json();
                setReviews([data, ...reviews]);
                setStars(0);
                setComment('');
                handleShowToastMessage("success", "La tua recensione è stata aggiunta.");
            } catch (err) {
                setError(err.message);
            } finally {
                setSendingReview(false);
            }
        }
    };

    const updateReview = (updatedReview) => {
        setReviews(reviews.map(review => review._id === updatedReview._id ? updatedReview : review));
    };

    const deleteReview = (reviewId) => {
        setReviews(reviews.filter(review => review._id !== reviewId));
    };

    const handleCloseLoginAlert = () => {
        setShowLoginAlert(false);
    };

    const handleShowToastMessage = (type, text) => {
        setToastMessageText(text);
        setToastMessageType(type);
        setShowToastMessage(true);
    };

    const handleCloseToastMessage = () => {
        setShowToastMessage(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-4">
                <Spinner animation="border" role="status"></Spinner>
                <span className='ms-2'>Caricamento in corso...</span>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Container>
            <h2 className="title-news mt-0 pb-4">Recensioni</h2>
            <Row className="mb-4">
                <Col>
                    <Form onSubmit={handleFormSubmit} className='text-center'>
                        <Form.Group controlId="stars">
                            <StarRating
                                count={5}
                                size={30}
                                value={stars}
                                onChange={(newRating) => setStars(newRating)}
                            />
                        </Form.Group>
                        <Form.Group controlId="comment" className='d-flex flex-column align-items-center'>
                            <Form.Label>Aggiungi il tuo commento</Form.Label>
                            <Form.Control className='form-review-area' as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
                        </Form.Group>
                        <Button id='sendReview-btn' variant="primary" type="submit" disabled={sendingReview}>
                            {sendingReview ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Invia recensione'}
                        </Button>
                    </Form>
                </Col>
            </Row>
            <ReviewList 
                reviews={reviews} 
                updateReview={updateReview}
                deleteReview={deleteReview}
                handleShowToastMessage={handleShowToastMessage}
            />
            <Modal show={showLoginAlert} onHide={handleCloseLoginAlert}>
                <Modal.Header closeButton>
                    <Modal.Title>Avviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>Per inviare recensioni devi prima effettuare il login.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLoginAlert}>
                        Chiudi
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastMessage
                message={toastMessageText}
                type={toastMessageType}
                onClose={handleCloseToastMessage}
                show={showToastMessage}
            />
        </Container>
    );
};

export default CompanyReviews;
