import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";

// Configuro dotenv per caricare le variabili d'ambiente dal file .env
configDotenv();

const secret = process.env.USER_JWT_SECRET;

// Metodo per generare un token JWT
function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' }); // Il token scade dopo 1 ora
}

// Opzioni per configurare Oauth di Google
const options = {
    clientID: process.env.G_CLIENT_ID, 
    clientSecret: process.env.G_SECRET, 
    callbackURL: process.env.G_CB // callback da eseguire quando un utente effettua l'autenticazione con google
}

// Creo un'istanza di GoogleStrategy
const googleStrategy = new GoogleStrategy(options, async (accessToken, refreshToken, profile, passportNext) => {

    try {
        // Destrutturo oggetto profile
        const { email, given_name, family_name, picture, sub } = profile._json;
    
        // Verifico se l'author esiste già nel DB
        const foundUser = await User.findOne( { email } );

        if (foundUser) {
            // Creo token di accesso 
            const token = generateToken(foundUser);

            // Chiamo callback passando null come errore e il token di accesso come secondo parametro
            passportNext(null, { token });
        } else {
            // Creo un nuovo utente con google
            const newUser = new User({
                email: email,
                nome: given_name, 
                cognome: family_name, 
                avatar: picture,
                googleId: sub,
            });

            await newUser.save(); 

            // Creo token con la funzione jwt
            const token = generateToken(newUser);

            passportNext(null, { token });
        }        
    } catch (error) {
        passportNext(error);
    }
}); 

export default googleStrategy;