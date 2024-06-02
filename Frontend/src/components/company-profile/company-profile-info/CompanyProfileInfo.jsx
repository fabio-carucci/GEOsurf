import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Card, Modal, Button, Spinner, Tooltip, OverlayTrigger, InputGroup, FormControl, Form } from 'react-bootstrap';
import { FaUpload, FaPenToSquare } from "react-icons/fa6";
import './CompanyProfileInfo.css';
import { useAuth } from '../../../context/AuthContextProvider';
import placeholderLogo from '../../../assets/placeholderLOGO.jpg';
import placeholderImage from '../../../assets/placeholderCOVER.jpg';

const CompanyProfileInfo = ({ myCompany }) => {
    const { token, user, setUser } = useAuth();
    const apiURL = process.env.REACT_APP_API_URL;

    const [itsME, setItsME] = useState(false); // Stato per gestire se l'utente autenticato è quello nella pagina profilo

    const [company, setCompany] = useState(myCompany)
    const [formData, setFormData] = useState({
        nome: company.nome, 
        email: company.email,
        partitaIVA: company?.partitaIVA || "",
        indirizzo: {
            via: company.indirizzo.via,
            città: company.indirizzo.città,
            CAP: company.indirizzo.CAP,
            provincia: company.indirizzo?.provincia || "",
            regione: company.indirizzo?.regione || "",
            paese: company.indirizzo.paese
        },
        telefono: company?.telefono || "",
        websiteURL: company?.websiteURL || ""
    })
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewLogoURL, setPreviewLogoURL] = useState(null);
    const [previewCoverURL, setPreviewCoverURL] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [editingModalShow, setEditingModalShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [currentImageType, setCurrentImageType] = useState(null);

    useEffect(()=>{
        (user?.email === company.email) ? setItsME(true) : setItsME(false);
    }, [user, company]);

    useEffect(()=>{
        if (itsME) {
            fetchMyProfile();
        }
    }, [itsME]);

    const fetchMyProfile = async () => {
        try {
            const response = await fetch(`${apiURL}/company/myProfile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCompany(data); // Imposta i nuovi dati dell'azienda ottenuti dalla chiamata
                setFormData(data);
            } else {
                console.error('Failed to fetch company profile');
            }
        } catch (error) {
            console.error('Error fetching company profile:', error);
        }
    };

    async function handleImageUpdate (imageType) {
        try {
            setIsLoading(true);
            const imageFormData = new FormData();
            imageFormData.append(imageType, selectedFile);

            const endpoint = imageType === 'logo' ? `${apiURL}/company/updateCompanyLogo` : `${apiURL}/company/updateCompanyCover`;

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: imageFormData,
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

    const handleChangeFormData = (e) => {
        const { name, value } = e.target;
    
        // Se il campo è all'interno di indirizzo
        if (name.startsWith('indirizzo.')) {
            const addressField = name.split('.')[1]; // Ottieni il nome del campo dell'indirizzo
            setFormData(prevState => ({
                ...prevState,
                indirizzo: {
                    ...prevState.indirizzo,
                    [addressField]: value // Aggiorna il campo dell'indirizzo corrispondente
                }
            }));
        } else {
            // Se il campo non è all'interno di indirizzo, aggiorna direttamente il campo nel formData
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
       

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        setError('');
        setIsLoading(true);
    
        try {
            const response = await fetch(`${apiURL}/company/updateCompany`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const updatedCompany = await response.json();
                setUser(updatedCompany);
                localStorage.setItem('user', JSON.stringify(updatedCompany));
                setEditingModalShow(false);
                
                // Aggiorna i dati della pagina
                setCompany(updatedCompany);
            } else {
                throw new Error('Failed to update company info');
            }
        } catch (error) {
            console.error('Error updating company info:', error);
            setError('Failed to update company info');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="profile-container">
            {company && (
                <Card className="profile-card">
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={6} xl={5} className="profile-image-container">
                                <div className="profile-logo-container">
                                    <Image src={previewLogoURL || company.logo || placeholderLogo} roundedCircle fluid className="profile-logo" />
                                    {itsME && (
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
                                    <Image src={previewCoverURL || company.cover || placeholderImage} fluid className="profile-cover" />
                                    {itsME && (
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
                                </div>
                            </Col>
                            <Col xs={12} md={6} xl={7} className='ps-0'>
                                <Card.Text className="profile-title text-uppercase fw-bold ps-0">{company.nome}</Card.Text>
                                <div className='profile-info-container py-4 py-md-0'>  
                                    <Card.Text className='mb-0'>
                                        <strong>Email:</strong> {company.email}
                                    </Card.Text>
                                    <Card.Text className='mb-0'>
                                        <strong>Indirizzo: </strong>
                                        <span>{company.indirizzo.via}, </span>
                                        <span>{company.indirizzo.CAP} {company.indirizzo.città}</span><br />
                                        <span>{company.indirizzo.provincia}, {company.indirizzo.regione}, {company.indirizzo.paese}</span>
                                    </Card.Text>
                                    <Card.Text className='mb-0'><strong>Telefono:</strong> {company.telefono || "-"}</Card.Text>
                                    <Card.Text className='mb-0'>
                                        <strong>Sito Web:</strong> {company.websiteURL 
                                            ? <a href={company.websiteURL} target="_blank" rel="noopener noreferrer">{company.websiteURL}</a>
                                            : '-'
                                        }
                                    </Card.Text>                        
                                    {itsME && <Card.Text className='mb-0'><strong>Partita IVA:</strong> {company.partitaIVA}</Card.Text>}
                                    {itsME && (
                                        <div className='custom-modified-info' onClick={() => setEditingModalShow(true)}>
                                            <div>Modifica i dati anagrafici</div>
                                            <FaPenToSquare />
                                        </div>
                                    )}
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

            <Modal
                show={editingModalShow}
                onHide={() => setEditingModalShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Modifica dati anagrafici</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpdate}>
                    <Form.Group controlId="formNome">
                        <Form.Label>Nome <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" value={formData.nome} name="nome" onChange={handleChangeFormData} required />
                    </Form.Group>

                    <Form.Group controlId="formEmail" className='mt-2'>
                        <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="email" value={formData.email} onChange={handleChangeFormData} name="email" disabled/>
                    </Form.Group>

                    <Form.Group controlId="formPartitaIva" className='mt-2'>
                        <Form.Label>Partita IVA <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" value={formData.partitaIVA} onChange={handleChangeFormData} name="partitaIVA" required />
                    </Form.Group>

                    <Form.Group controlId="formTelefono" className='mt-2'>
                        <Form.Label>Telefono </Form.Label>
                        <Form.Control type="text" value={formData.telefono} onChange={handleChangeFormData} name="telefono" />
                    </Form.Group>

                    <Form.Group controlId="formWebsiteURL" className='mt-2'>
                        <Form.Label>Sito Web </Form.Label>
                        <Form.Control type="text" value={formData.websiteURL} onChange={handleChangeFormData} name="websiteURL" />
                    </Form.Group>

                    <Row>
                        <Col md={12}>
                            <Form.Group controlId="formIndirizzoVia" className="mt-2">
                                <Form.Label>Via <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" value={formData.indirizzo.via} onChange={handleChangeFormData} name="indirizzo.via" required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={8}>
                            <Form.Group controlId="formIndirizzoCitta" className="mt-2">
                                <Form.Label>Città <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" value={formData.indirizzo.città} onChange={handleChangeFormData} name="indirizzo.città" required />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group controlId="formIndirizzoCAP" className="mt-2">
                                <Form.Label>CAP <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" value={formData.indirizzo.CAP} onChange={handleChangeFormData} name="indirizzo.CAP" required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4} lg={2}>
                            <Form.Group controlId="formIndirizzoProvincia" className="mt-2">
                                <Form.Label>Provincia </Form.Label>
                                <Form.Control type="text" value={formData.indirizzo?.provincia || ""} onChange={handleChangeFormData} name="indirizzo.provincia"/>
                            </Form.Group>
                        </Col>
                        <Col sm={8} lg={5}>
                            <Form.Group controlId="formIndirizzoRegione" className="mt-2">
                                <Form.Label>Regione </Form.Label>
                                <Form.Control type="text" value={formData.indirizzo?.regione || ""} onChange={handleChangeFormData} name="indirizzo.regione"/>
                            </Form.Group>
                        </Col>
                        <Col sm={12} lg={5}>
                            <Form.Group controlId="formIndirizzoPaese" className="mt-2">
                                <Form.Label>Paese <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" value={formData.indirizzo.paese} onChange={handleChangeFormData} name="indirizzo.paese" required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="text-center">
                        <Button variant="outline-primary" className="mt-4 px-4" type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Aggiorna i dati'}
                        </Button>
                    </div>

                    {error && <p className="text-danger mt-2">{error}</p>}
                    <p className="text-muted mt-2"><span className="text-danger">*</span> Obbligatorio</p>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setEditingModalShow(false) }>Chiudi</Button>
            </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CompanyProfileInfo;
