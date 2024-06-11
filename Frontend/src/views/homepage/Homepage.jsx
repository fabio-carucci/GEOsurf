import './Homepage.css';
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContextProvider';
import SearchBar from '../../components/search-bar/SearchBar';
import CompanyList from '../../components/company-list/CompanyList'
import NewsList from '../../components/news-list/NewsList';
import MyResponsiveChoropleth from '../../components/nivo-geomap/Choropleth';

export default function Homepage() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const [accessToken, setAccessToken] = useState('');

    const location = useLocation();

    // Funzione per estrarre il valore di accessToken dalla stringa di query
    const getAccessTokenFromQuery = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('accessToken');
    };

    useEffect(() => {
        const token = getAccessTokenFromQuery();
        if (token) {
            setAccessToken(token);
        }
    }, [location.search]);

    useEffect(() => {
        if (accessToken) {
            console.log("Access Token:", accessToken);
            login(accessToken, "user")
        }
    }, [accessToken, login]);

    return (
        <div>
            <SearchBar 
                onSearchResults={setSearchResults} 
                searchPerformed={searchPerformed} 
                setSearchPerformed={setSearchPerformed}
                loading={loading}
                setLoading={setLoading}
            />
            <CompanyList 
                results={searchResults} 
                searchPerformed={searchPerformed}
                loading={loading}
            />
            {!searchPerformed && <MyResponsiveChoropleth/>}
            {!searchPerformed && <NewsList />}
        </div>
    )
}