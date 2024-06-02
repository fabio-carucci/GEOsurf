import React, { useState } from 'react';
import { Container, Row, Col, Image, Card, Modal, Button, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaUpload } from "react-icons/fa6";
import './CompanyProfileInfo.css';
import { useAuth } from '../../../context/AuthContextProvider';
import placeholderLogo from '../../../assets/placeholderLOGO.jpg';
import placeholderImage from '../../../assets/placeholderCOVER.jpg';

const CompanyProfileInfo = ({ company }) => {
    const { nome, email, indirizzo, telefono, logo, cover, websiteURL } = company || {};
    const { token, user, setUser } = useAuth();
    const apiURL = process.env.REACT_APP_API_URL;

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewLogoURL, setPreviewLogoURL] = useState(null);
    const [previewCoverURL, setPreviewCoverURL] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentImageType, setCurrentImageType] = useState(null);

    async function handleImageUpdate (imageType) {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append(imageType, selectedFile);

            const endpoint = imageType === 'logo' ? `${apiURL}/company/updateCompanyLogo` : `${apiURL}/company/updateCompanyCover`;

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const { updatedCompany } = await response.json();

                setUser(updatedCompany);
                localStorage.setItem("user", JSON.stringify(updatedCompany)); // Memorizza nel localStorage

                setSelectedFile(null);
                
                if(imageType === 'logo'){
                    setPreviewLogoURL(updatedCompany.logo);
                    console.log('Logo uploaded successfully', updatedCompany);
                } else {
                    setPreviewCoverURL(updatedCompany.cover);
                    console.log('Cover uploaded successfully', updatedCompany);
                }
            } else {
                console.error('Failed to upload');
            }
        } catch (error) {
            console.error('Error uploading:', error);
        } finally {
            setIsLoading(false);
            setShowConfirmModal(false);
        }
    };

    const handleFileChange = (file, imageType) => {
        if (file) {
            setSelectedFile(file);
            setCurrentImageType(imageType);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (imageType === "logo") {
                    setPreviewLogoURL(reader.result);
                } else {
                    setPreviewCoverURL(reader.result);
                }
                setShowConfirmModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelUpload = () => {
        setShowConfirmModal(false);
        setSelectedFile(null);
        setPreviewLogoURL(null);
        setPreviewCoverURL(null);
        setCurrentImageType(null);
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Cambia logo
        </Tooltip>
    );

    return (
        <Container className="profile-container">
            {company && (
                <Card className="profile-card">
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={6} xl={5} className="profile-image-container">
                                <div className="profile-logo-container">
                                    <Image src={previewLogoURL || logo || placeholderLogo} roundedCircle fluid className="profile-logo" />
                                    {(user?.email === email) && (
                                        <div className='upload-icon'>
                                            <OverlayTrigger placement="right" overlay={renderTooltip}>
                                                <label htmlFor="logo-upload">
                                                    <FaUpload style={{ cursor: "pointer" }} />
                                                    <input
                                                        id="logo-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e.target.files[0], "logo")}
                                                        style={{ display: "none" }}
                                                        onClick={(e) => e.target.value = null} // Reset the file input value
                                                    />
                                                </label>
                                            </OverlayTrigger>
                                        </div>
                                    )}
                                </div>
                                <div className="cover-container">
                                    <Image src={previewCoverURL || cover || placeholderImage} fluid className="profile-cover" />
                                    {(user?.email === email) && (
                                        <div className="cover-upload-bar">
                                            <label htmlFor="cover-upload" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                                Cambia Cover <FaUpload style={{ marginLeft: "5px" }} />
                                                <input
                                                    id="cover-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e.target.files[0], "cover")}
                                                    style={{ display: "none" }}
                                                    onClick={(e) => e.target.value = null} // Reset the file input value
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>                            </Col>
                            <Col xs={12} md={6} xl={7} className='ps-0'>
                                <Card.Text className="profile-title text-uppercase fw-bold ps-0">{nome}</Card.Text>
                                <div className='profile-info-container py-4 py-md-0'>
                                    <Card.Text><strong>Email:</strong> {email}</Card.Text>
                                    <Card.Text>
                                        <strong>Indirizzo: </strong>
                                        <span>{indirizzo.via}</span>
                                        <span>{indirizzo.CAP} {indirizzo.città}</span><br />
                                        <span>{indirizzo.provincia}, {indirizzo.regione}, {indirizzo.paese}</span>
                                    </Card.Text>
                                    {telefono && <Card.Text><strong>Telefono:</strong> {telefono}</Card.Text>}
                                    {websiteURL && <Card.Text><strong>Sito Web:</strong> <a href={websiteURL} target="_blank" rel="noopener noreferrer">{websiteURL}</a></Card.Text>}
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            <Modal show={showConfirmModal} onHide={handleCancelUpload}>
                <Modal.Header closeButton>
                    <Modal.Title>Conferma modifica {currentImageType}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image src={previewLogoURL || previewCoverURL} fluid className="small-modal-image" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelUpload}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={()=>handleImageUpdate(currentImageType)} disabled={isLoading}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : 'Conferma'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CompanyProfileInfo;
