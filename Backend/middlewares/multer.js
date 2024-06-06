import multer from 'multer';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

// Configurazione di Cloudinary
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurazione di multer con lo storage di Cloudinary
const logoStorage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
        folder: 'company-logo', // Cartella dove vengono salvati i loghi delle aziende
        allowed_formats: ['jpg', 'jpeg', 'png'], // Formati consentiti
        format: async (req, file) => 'jpg' // Funzione per modificare il formato, se necessario
    }
});

// Configurazione di multer con lo storage di Cloudinary
const coverStorage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
        folder: 'company-cover', // Cartella dove vengono salvate le foto di copertina delle aziende
        allowed_formats: ['jpg', 'jpeg', 'png'], // Formati consentiti
        format: async (req, file) => 'jpg' // Funzione per modificare il formato, se necessario
    }
});

// Configurazione di multer con lo storage di Cloudinary
const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
        folder: 'avatars', // Cartella dove vengono salvati gli avatar
        allowed_formats: ['jpg', 'jpeg', 'png'], // Formati consentiti
        format: async (req, file) => 'jpg' // Funzione per modificare il formato, se necessario
    }
});

const uploadCompanyLogo = multer({ storage: logoStorage }).single('logo');
const uploadCompanyCover = multer({ storage: coverStorage }).single('cover');
const uploadAvatar = multer({ storage: avatarStorage }).single('avatar');

export { uploadCompanyLogo, uploadCompanyCover, uploadAvatar };