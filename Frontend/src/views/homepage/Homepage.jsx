import './Homepage.css';
import React, { useState } from 'react';
import SearchBar from '../../components/search-bar/SearchBar';
import CompanyList from '../../components/company-list/CompanyList'
import NewsList from '../../components/news-list/NewsList';

export default function Homepage() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [loading, setLoading] = useState(false);

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
            {!searchPerformed && <NewsList />}
        </div>
    )
}