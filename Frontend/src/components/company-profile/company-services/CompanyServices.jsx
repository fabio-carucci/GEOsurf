import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaPenToSquare } from "react-icons/fa6";
import { Container } from 'react-bootstrap';
import './CompanyServices.css';
import { useAuth } from '../../../context/AuthContextProvider';
import ServicesModal from './ServicesModal';

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 4,
        slidesToSlide: 1,
    },
    desktop: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: { max: 768, min: 464 },
        items: 2,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};

const CompanyServices = ({ services, companyID, setCompany }) => {
    const [itsME, setItsME] = useState();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { user, setUser, token } = useAuth();

    const apiURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        (user?._id === companyID) ? setItsME(true) : setItsME(false)
    }, [companyID, user])

    const handleSave = async (selectedServices) => {
        setError('');
        setLoading(true);
    
        try {
            const response = await fetch(`${apiURL}/company/updateCompanyServices`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({services: selectedServices}),
            });

            if (response.ok) {
                const {updatedCompany} = await response.json();
                setUser(updatedCompany);
                localStorage.setItem('user', JSON.stringify(updatedCompany));
                setShowModal(false);

                // Aggiorna i dati sui servizi nella pagina
                setCompany(updatedCompany);
            } else {
                throw new Error('Failed to update company services');
            }
        } catch (error) {
            console.error('Error updating company services:', error);
            setError('Failed to update company services');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="services-carousel-container">
            {services.length > 0 ? (
                <Carousel
                    additionalTransfrom={0}
                    arrows
                    autoPlaySpeed={3000}
                    centerMode={false}
                    className="custom-carousel-list"
                    dotListClass=""
                    draggable
                    focusOnSelect={false}
                    infinite={true}
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    pauseOnHover
                    renderArrowsWhenDisabled={false}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={responsive}
                    rewind={false}
                    rewindWithAnimation={false}
                    rtl={false}
                    shouldResetAutoplay
                    showDots={false}
                    sliderClass=""
                    slidesToSlide={1}
                    swipeable
                >
                    {services.map((service, index) => (
                        <div key={index} className="service-box">
                            <div className="service-icon">{service.icona}</div>
                            <div className="service-name">{service.nome}</div>
                        </div>
                    ))}
                </Carousel>
            ) : (
                <div className="no-services-message">
                    Non sono stati ancora inseriti i servizi offerti.
                </div>
            )}
            {itsME && (
                <div className='custom-modified-services' onClick={() => setShowModal(true)}>
                    <div>{services.length > 0 ? "Aggiorna i servizi" : "Aggiungi i servizi"}</div>
                    <FaPenToSquare />
                </div>
            )}
            <ServicesModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSave={handleSave}
                currentServices={services.map(service => service.nome)} // Utilizzo solo i nomi dei servizi attuali
                allServices={[
                    "Corsi Surf", 
                    "Noleggio Attrezzatura", 
                    "Corsi Kitesurf", 
                    "Rimessaggio Tavole", 
                    "Esperienze Outdoor", 
                    "Corsi Windsurf", 
                    "Yoga SUP", 
                    "Corsi Skate", 
                    "Academy", 
                    "Surf trips"
                ]}
                loading={loading}
                error={error}
            />
        </Container>
    );
};

export default CompanyServices;