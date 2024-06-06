import express from 'express';
import { createReview, getReviewsByCompanyId, getReviewsByAuthor, updateReview, deleteReview } from '../../controllers/reviews/reviewsController.js';
import jwtUserVerifier from '../../middlewares/jwtUserVerifier.js';

const router = express.Router();

// Definizione delle route
router
    .post('/createReview', jwtUserVerifier, createReview) // Route POST per creare una recensione
    .get('/reviews/:companyId', getReviewsByCompanyId) // Route GET per cercare le recensioni dall'id della company
    .get('/getReviewsByAuthor', jwtUserVerifier, getReviewsByAuthor) // Route GET per cercare le recensioni dall'autore autenticato
    .put('/updateReview/:reviewId', jwtUserVerifier, updateReview) // Route PUT per aggiornare le info delle recensioni
    .delete('/deleteReview/:reviewId', jwtUserVerifier, deleteReview) // Route DELETE per eliminare la recensione

export default router;