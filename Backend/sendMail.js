import nodemailer from 'nodemailer';
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();


// Funzione per inviare mail
const sendMail = async (sendTo, mailSubject, mailBody) => {

    // Configurazione provider mail, preso smtp fake da ethereal email
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    try {
        const mail = await transporter.sendMail({
            from: `GEOsurf <${process.env.EMAIL_ADDRESS}>`,
            to: sendTo,
            subject: mailSubject,
            html: mailBody
        })
        console.log(mail.messageId);
    } catch (error) {
        console.log(error);
    }
};

export default sendMail;