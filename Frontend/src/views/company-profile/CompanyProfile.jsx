import React, { useState, useEffect } from 'react';
import './CompanyProfile.css';
import { useParams } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import CompanyProfileInfo from '../../components/company-profile/company-profile-info/CompanyProfileInfo'
import CompanyServices from '../../components/company-profile/company-services/CompanyServices';
import CompanyReviews from '../../components/company-profile/company-reviews/CompanyReviews';

const CompanyProfile = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const apiURL = process.env.REACT_APP_API_URL;

    const fetchCompany = async () => {
        try {
            const response = await fetch(`${apiURL}/companyProfile/${id}`);
            if (!response.ok) {
                throw new Error('Errore durante il recupero del profilo aziendale.');
            }
            const data = await response.json();
            setCompany(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-4">
                <Spinner animation="border" role="status"></Spinner>
                <span className='ms-2'>Caricamento in corso...</span>
            </div>
        )
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <>
            <CompanyProfileInfo 
                myCompany={company}
            />
            <CompanyServices 
                companyID={id}
                services={company.servizi}
                setCompany={setCompany}
            />
            <CompanyReviews
                companyId={id}
            />
        </>
    );
};

export default CompanyProfile;
