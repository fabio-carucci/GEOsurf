import React, { useState, useEffect } from 'react';
import './FavoritePage.css';
import { useAuth } from '../../context/AuthContextProvider';
import CompanyList from '../../components/company-list/CompanyList';
import { Container } from 'react-bootstrap';

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { user } = useAuth();

  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const getFavoritesCompanies = async () => {
      if (!user || !user.preferiti || !Array.isArray(user.preferiti)) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiURL}/companies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: user.preferiti })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getFavoritesCompanies();
  }, [user, apiURL]);
  
  return (
    <Container>
      <h2 className='title-news'>Le tue scuole di surf preferite</h2>
      {error && <p className="error">{error}</p>}
      <CompanyList results={favorites} searchPerformed={true} loading={loading} />
    </Container>
  );
}