import React, { createContext, useState, useContext, useEffect } from "react";
import SessionExpirationAlert from "../components/session-expiration-alert/SessionExpirationAlert";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false); // Stato per gestire l'avviso che sta per scadere la sessione
    const [isSessionExpired, setIsSessionExpired] = useState(false); // Stato per gestire la renderizzazione del toast message di sessione scaduta

    // Funzione per controllare la validità del token
    const checkTokenValidity = () => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return; // Se non c'è un token salvato, esci
    
        // Decodifica il token per ottenere la data di scadenza
        const { exp } = JSON.parse(atob(storedToken.split('.')[1]));
    
        // Calcola il timestamp attuale
        const currentTime = Math.floor(Date.now() / 1000);
    
        // Calcola il timestamp di scadenza del token meno 10 minuti
        const tokenExpirationMinus10Minutes = exp - 600; // 600 secondi = 10 minuti
    
        // Se il timestamp attuale è maggiore del timestamp di scadenza meno 10 minuti,
        // imposta sessionExpired a true e mostra il modal TokenExpirationAlert
        if (currentTime >= tokenExpirationMinus10Minutes) {
            setSessionExpired(true);
        }
    };

    const apiURL = process.env.REACT_APP_API_URL;

    const login = async (token, role) => {
        setToken(token);
        localStorage.setItem("token", token); // Memorizza il token di accesso dell'utente nel localStorage

        setRole(role);
        localStorage.setItem("role", role); // Memorizza il ruolo di chi ha effettuato l'accesso

        setIsLogged(true);
        localStorage.setItem("isLogged", "true"); // Memorizza lo stato di autenticazione nel localStorage

        const endpoint = role === "user" ? "/user/userProfile" : "/company/companyProfile";

        try {
            const response = await fetch(`${apiURL}${endpoint}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}` // Aggiungi il token JWT dell'utente nell'header
                }
            });
            const data = await response.json();
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data)); // Memorizza l'utente nel localStorage
        } catch (error) {
            console.error('Errore durante il recupero del profilo:', error);
        }
    };

    const logout = () => {
        setToken(null);
        setIsLogged(false);
        setRole(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("isLogged");
        localStorage.removeItem("user");
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");
        const storedIsLogged = localStorage.getItem("isLogged") === "true";
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedRole && storedIsLogged && storedUser) {
            setToken(storedToken);
            setRole(storedRole);
            setIsLogged(storedIsLogged);
            setUser(JSON.parse(storedUser));

            // Controlla se il token è scaduto
            const { exp } = JSON.parse(atob(storedToken.split('.')[1]));
            if (Date.now() >= exp * 1000) {
                logout();
            }
        }
    }, []);

    useEffect(() => {
        // Esegue il controllo della validità del token ogni 5 minuti
        const interval = setInterval(() => {
            checkTokenValidity();
        }, 5 * 60 * 1000); // 5 minuti
    
        // Pulisce l'intervallo quando il componente si smonta
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setIsSessionExpired(localStorage.getItem('isSessionExpired'));
      
        if (isSessionExpired) {
      
          // Imposta sessionExpired su false dopo 10 secondi
          const timeoutId = setTimeout(() => {
            setIsSessionExpired(false);
            localStorage.removeItem('isSessionExpired'); // Rimuove il flag di sessione scaduta dal localStorage
          }, 30000); // 30 secondi
      
          return () => clearTimeout(timeoutId);
        }
    }, [isSessionExpired]);

    const handleCloseToastMessage = () => {
        setIsSessionExpired(false);
        localStorage.removeItem('isSessionExpired');
    };


    return (
        <AuthContext.Provider value={{ token, isLogged, role, user, login, logout }}>
            {children}
            {sessionExpired && <SessionExpirationAlert logout={logout} role={role} token={token} setToken={setToken} setSessionExpired={setSessionExpired}/>}
            {/* Mostra il toast quando sessionExpired è true */}
            {isSessionExpired && (
                <div className="toast-container position-fixed top-0 end-0 p-3">
                    <div className="toast d-block" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto text-danger">Attenzione</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={handleCloseToastMessage}></button>
                        </div>
                        <div className="toast-body">
                            La sessione è scaduta.
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
};