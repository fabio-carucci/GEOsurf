// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../../context/AuthContextProvider';
// import { useLocation } from "react-router-dom";
// import { Button } from 'react-bootstrap';


// export default function GoogleLoginButton() {
//     const { login } = useAuth();
//     const [error, setError] = useState('');

//     // Utilizza useLocation per ottenere la stringa di query
//     const location = useLocation();
//     // Funzione per estrarre il valore di accessToken dalla stringa di query
//     const getAccessTokenFromQuery = () => {
//         const searchParams = new URLSearchParams(location.search);
//         return searchParams.get('accessToken');
//     };
//     // Ottieni accessToken all'avvio del componente
//     const accessToken = getAccessTokenFromQuery();

//     const handleGoogleLoginClick = () => {
//         const googleAuthUrl = "https://m6w1d1-inzr.onrender.com/googleLogin";
//         window.open(googleAuthUrl, "_self");
//       };
    
//       const fetchMyProfile = async () => {
//         try {
//           const response = await fetch('https://m6w1d1-inzr.onrender.com/me', {
//             method: 'GET', 
//             headers: {
//               'Authorization': `Bearer ${accessToken}`
//             }
//           });
    
//           // Verifico se la risposta è stata ricevuta correttamente
//           if (!response.ok) {
//             // Recupera il messaggio di errore dal corpo della risposta
//             const { message } = await response.json();
//             throw new Error(message);
//           }
//           // Recupera i dati dell'utente loggato dal corpo della risposta
//           const author = await response.json()
//           // Eseguo il login utilizzando i dati del formData
//           await login(accessToken, author);
    
//         } catch (error) {
//           setError('Errore durante il login: ' + error.message);
//         }
//       };
    
//       useEffect(() => {
//         if(accessToken) {
//           fetchMyProfile();
//         }
//       }, []);    

//   return (
//     <div>
//         <Button variant="outline-danger" className="mt-2" onClick={handleGoogleLoginClick}>
//             Accedi con Google
//         </Button>
        
//         {/* Mostra un messaggio di errore se presente */}
//         {error && <p className="text-danger mt-2">{error}</p>}
//     </div>
//   )
// }