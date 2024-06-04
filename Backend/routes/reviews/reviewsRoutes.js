import express from 'express';
import { createReview, getReviewsByCompanyId, getReviewsByAuthor } from '../../controllers/reviews/reviewsController.js';
import jwtUserVerifier from '../../middlewares/jwtUserVerifier.js';

const router = express.Router();

// Definizione delle route
router
    .post('/createReview', jwtUserVerifier, createReview) // Route POST per creare una recensione
    .get('/reviews/:companyId', getReviewsByCompanyId) // Route GET per cercare le recensioni dall'id della company
    .get('/getReviewsByAuthor', jwtUserVerifier, getReviewsByAuthor) // Route GET per cercare le recensioni dall'autore autenticato

export default router;
