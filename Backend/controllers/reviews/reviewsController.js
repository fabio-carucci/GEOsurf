import Review from '../../models/review.js';
import User from '../../models/user.js';
import Company from '../../models/company.js';

// Metodo per creare le recensioni
const createReview = async (req, res, next) => {
    try {
        const { stars, comment, companyId } = req.body;

        // Crea una nuova recensione
        let review = await Review.create({
            author: req.user._id,
            company: companyId,
            stars,
            comment
        });

        // Aggiungi la recensione all'array delle recensioni dell'utente
        await User.findByIdAndUpdate(req.user._id, { $push: { reviews: review._id } });

        // Aggiungi la recensione all'array delle recensioni della company
        await Company.findByIdAndUpdate(companyId, { $push: { reviews: review._id } });

        // Popola il campo author con i campi nome e cognome
        review = await Review.findById(review._id).populate('author', 'nome cognome');

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
                                    .populate('company', 'nome') // Popola i campi della company
                                    .sort({ createdAt: -1 }); // Ordina dalla più recente alla meno recente

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Errore durante il recupero delle recensioni', error);
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

// Metodo per aggiornare una recensione
const updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { stars, comment } = req.body;

        // Trova e aggiorna la recensione solo se l'autore corrisponde all'utente autenticato
        const review = await Review.findOneAndUpdate(
            { _id: reviewId, author: req.user._id },
            { stars, comment },
            { new: true }
        ).populate('author', 'nome cognome');

        if (!review) {
            return res.status(404).json({ message: 'Recensione non trovata o non autorizzato' });
        }

        res.status(200).json(review);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della recensione:', error);
        next(error);
    }
};

// Metodo per rimuovere una recensione
const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        // Trova e rimuovi la recensione solo se l'autore corrisponde all'utente autenticato
        const review = await Review.findOneAndDelete({ _id: reviewId, author: req.user._id });

        if (!review) {
            return res.status(404).json({ message: 'Recensione non trovata o non autorizzato' });
        }

        // Rimuovi la recensione dall'array delle recensioni dell'utente
        await User.findByIdAndUpdate(req.user._id, { $pull: { reviews: reviewId } });

        // Rimuovi la recensione dall'array delle recensioni della company
        await Company.findByIdAndUpdate(review.company, { $pull: { reviews: reviewId } });

        res.status(200).json({ message: 'Recensione rimossa con successo' });
    } catch (error) {
        console.error('Errore durante la rimozione della recensione:', error);
        next(error);
    }
};

export {
    createReview,
    getReviewsByCompanyId,
    getReviewsByAuthor,
    updateReview,
    deleteReview
};