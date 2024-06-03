import News from "../../models/news.js";
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

// Metodo per creare una news
const createNews = async (req, res, next) => {
    try {
        const { title, body } = req.body;

        // Creazione e salvataggio della news nel database
        const news = await News.create({
            author: req.user._id,
            title,
            body
        });

        // Risposta con la news creata
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Metodo per recuperare tutte le news
const getNews = async (req, res, next) => {
    try {
        // Ottieni i parametri di paginazione dalla richiesta
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Recupera le news dal database con paginazione
        const news = await News.find()
                               .populate('author', 'nome cognome')
                               .sort({ createdAt: -1 })
                               .skip(skip)
                               .limit(limit);

        // Conta il numero totale di news nel database
        const totalNews = await News.countDocuments();

        // Risposta con le news recuperate e le informazioni di paginazione
        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalNews / limit),
            totalNews,
            news
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export {
    createNews,
    getNews
};