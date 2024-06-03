// Middleware per verificare se l'utente ha il ruolo di 'admin'
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // L'utente è admin, passa al prossimo middleware
    } else {
        res.status(401).json({ message: 'L\'utente in corso non può effettuare queste operazioni' }); // L'utente non è admin
    }
};

export default isAdmin;