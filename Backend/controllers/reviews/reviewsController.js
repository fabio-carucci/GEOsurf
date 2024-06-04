import Review from '../../models/review.js';
import User from '../../models/user.js';
import Company from '../../models/company.js';

// Metodo per creare le recensioni
const createReview = async (req, res, next) => {
    try {
        const { stars, comment, companyId } = req.body;

        // Crea una nuova recensione
        const review = await Review.create({
            author: req.user._id,
            company: companyId,
            stars,
            comment
        });

        // Aggiungi la recensione all'array delle recensioni dell'utente
        await User.findByIdAndUpdate(req.user._id, { $push: { reviews: review._id } });

        // Aggiungi la recensione all'array delle recensioni della company
        await Company.findByIdAndUpdate(companyId, { $push: { reviews: review._id } });

        res.status(201).json(review);
    } catch (error) {
        console.error('Errore durante la creazione della recensione:', error);
        next(error);    
    }
};

// Metodo per recuperare le recensioni in base alla companyId
const getReviewsByCompanyId = async (req, res, next) => {
    try {
        const { companyId } = req.params;

        // Trova tutte le recensioni per la companyId specificata
        const reviews = await Review.find({ company: companyId })
                                    .populate('author', 'nome cognome email') // Popola i campi dell'autore
                                    .populate('company', 'nome'); // Popola i campi della company

        res.status(200).json(reviews);
    } catch (error) {
        console.error(`Errore durante il recupero delle recensioni`, error);
        next(error);    
    }
};

// Metodo per recuperare le recensioni scritte da un autore
const getReviewsByAuthor = async (req, res, next) => {
    try {
        // Trova tutte le recensioni scritte dall'utente autenticato
        const reviews = await Review.find({ author: req.user._id })
                                    .populate('author', 'nome cognome')
                                    .populate('company', 'nome logo');

        res.status(200).json(reviews);
    } catch (error) {
        console.error(`Errore durante il recupero delle recensioni di ${req.user._id}:`, error);
        next(error); 
    }
};

export {
    createReview,
    getReviewsByCompanyId,
    getReviewsByAuthor
};