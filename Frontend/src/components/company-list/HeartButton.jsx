import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContextProvider';

function HeartButton({ isFavorite, companyId, toggleFavorite, setFavorites }) {
    const { token, setUser } = useAuth(); 
    const apiURL = process.env.REACT_APP_API_URL;

    const updateFavorites = async (companyId, isFavorite) => {
        try {
            const response = await fetch(`${apiURL}/user/updateFavorites`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    companyId: companyId,
                    isFavorite: isFavorite.toString()
                })
            });

            if (!response.ok) {
                throw new Error('Errore durante l\'aggiornamento dei preferiti');
            }

            const { updatedUser, preferiti } = await response.json();
            
            setUser(updatedUser); 
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setFavorites(preferiti);
        } catch (error) {
            console.error('Errore durante la chiamata fetch:', error);
        }
    };

    const handleClick = async () => {
        if (isFavorite && !window.confirm('Sei sicuro di voler rimuovere questo elemento dai preferiti?')) {
            return;
        }
        updateFavorites(companyId, !isFavorite); // Aggiorno i preferiti
        toggleFavorite(companyId); // Aggiorno lo stato locale dei preferiti
    };

    return (
        <>
            {isFavorite ? (
                <FaHeart className='heart-icon active' onClick={handleClick} />
            ) : (
                <FaRegHeart className='heart-icon' onClick={handleClick} />
            )}
        </>
    );
}

export default HeartButton;