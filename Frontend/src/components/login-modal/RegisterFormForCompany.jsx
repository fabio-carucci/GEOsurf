import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, InputGroup, Row, Col, CloseButton } from 'react-bootstrap';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContextProvider';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import countryList from 'react-select-country-list';

export default function RegisterFormForCompany({ onHide, setIsRegistering }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const apiURL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        // Controlla la validità della partita IVA
        const partitaIVA = formData.get('partitaIVA');
        if (!/^\d{11}$/.test(partitaIVA)) {
            setError('La partita IVA deve essere una stringa di 11 numeri.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Le password non coincidono.');
            return;
        }

        // Rimuovi confirmPassword dal formData
        formData.delete('confirmPassword');

        const indirizzo = {
            via: formData.get('via'),
            città: formData.get('città'),
            CAP: formData.get('CAP'),
            provincia: formData.get('provincia'),
            regione: formData.get('regione'),
            paese: selectedCountry ? selectedCountry.label : '',
            ISOcode: selectedCountry ? selectedCountry.value : ''
        };

        formData.delete('via');
        formData.delete('città');
        formData.delete('CAP');
        formData.delete('provincia');
        formData.delete('regione');
        formData.delete('paese');

        formData.append('indirizzo', JSON.stringify(indirizzo));

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${apiURL}/auth/createCompany`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                console.log('Registration successful', data.token);
                onHide();
                login(data.token, 'company');

                // Reindirizzamento alla pagina companyProfile con l'id
                navigate(`/companyProfile/${data.id}`);
            } else {
                setError(data.message || 'Errore di registrazione');
            }
        } catch (error) {
            setLoading(false);
            setError('Errore di connessione al server');
            console.error('Error during fetch:', error);
        } finally {
            setIsRegistering();
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password') {
            setPassword(value);
        } else {
            setConfirmPassword(value);
        }
    };

    useEffect(() => {
        // Controllo se entrambe le password sono state inserite e poi verifico se coincidono
        if (password && confirmPassword) {
            if (password === confirmPassword) {
                setPasswordMatch(true);
            } else {
                setPasswordMatch(false);
            }
        } else {
            // Se una delle due password è vuota, reimposto lo stato a null
            setPasswordMatch(null);
        }
    }, [password, confirmPassword]);

    const countries = countryList().getData();

    // Stile custom per rendere l'input di selezione dei paesi uguale agli altri di Bootstrap
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#80bdff' : '#dee2e6', // Bootstrap border color on focus and default
            borderRadius: '0.375rem', // Bootstrap border-radius
            boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : 'none', // Bootstrap focus shadow
            '&:hover': {
                borderColor: '#dee2e6', // Keep the same on hover
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#495057', // Bootstrap text color for form control
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#6c757d', // Bootstrap placeholder color
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#6c757d', // Bootstrap icon color
            '&:hover': {
                color: '#6c757d', // Keep the same on hover
            },
        })
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNome">
                <Form.Label>Nome <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="nome" required />
            </Form.Group>

            <Form.Group controlId="formEmail" className='mt-2'>
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control type="email" name="email" required />
            </Form.Group>

            <Form.Group controlId="formPassword" className='mt-2'>
                <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                    <Form.Control 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        required 
                        value={password}
                        onChange={handlePasswordChange}
                        style={{
                            backgroundColor: passwordMatch === false ? '#f8d7da' : passwordMatch === true ? '#d4edda' : 'transparent'
                        }}
                    />
                    <Button 
                        variant='outline-secondary'
                        style={{borderColor: "rgb(222 226 230)"}}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash />: <FaEye />}
                    </Button>
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className='mt-2'>
                <Form.Label>
                    Conferma Password <span className="text-danger">*</span>
                    {passwordMatch === false && <span className="text-danger"> Le password non coincidono.</span>}
                    {passwordMatch === true && <span className="text-success"> Le password coincidono.</span>}
                </Form.Label>
                <InputGroup>
                    <Form.Control 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword"  
                        required 
                        value={confirmPassword}
                        onChange={handlePasswordChange}
                        style={{
                            backgroundColor: passwordMatch === false ? '#f8d7da' : passwordMatch === true ? '#d4edda' : 'transparent'
                        }}
                    />
                    <Button 
                        variant="outline-secondary" 
                        style={{borderColor: "rgb(222 226 230)"}}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <FaEyeSlash />: <FaEye />}
                    </Button>
                </InputGroup>
            </Form.Group>

            <Form.Group controlId="formPartitaIva" className='mt-2'>
                <Form.Label>Partita IVA <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="partitaIVA" required />
            </Form.Group>

            <Row>
                <Col md={12}>
                    <Form.Group controlId="formIndirizzoVia" className="mt-2">
                        <Form.Label>Via <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="via" required />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={8}>
                    <Form.Group controlId="formIndirizzoCitta" className="mt-2">
                        <Form.Label>Città <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="città" required />
                    </Form.Group>
                </Col>
                <Col sm={4}>
                    <Form.Group controlId="formIndirizzoCAP" className="mt-2">
                        <Form.Label>CAP <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="CAP" required />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={4} lg={2}>
                    <Form.Group controlId="formIndirizzoProvincia" className="mt-2">
                        <Form.Label>Provincia</Form.Label>
                        <Form.Control type="text" name="provincia"/>
                    </Form.Group>
                </Col>
                <Col sm={8} lg={5}>
                    <Form.Group controlId="formIndirizzoRegione" className="mt-2">
                        <Form.Label>Regione</Form.Label>
                        <Form.Control type="text" name="regione"/>
                    </Form.Group>
                </Col>
                <Col sm={12} lg={5}>
                    <Form.Group controlId="formIndirizzoPaese" className="mt-2">
                        <Form.Label>Paese <span className="text-danger">*</span></Form.Label>
                        <Select 
                            options={countries} 
                            value={selectedCountry}
                            onChange={setSelectedCountry}
                            placeholder=""
                            styles={customStyles}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <div className="text-center">
                <Button variant="outline-primary" className="mt-4 px-4" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Crea account'}
                </Button>
            </div>

            {error && <p className="text-danger mt-2">{error}</p>}
            <p className="text-muted mt-2"><span className="text-danger">*</span> Obbligatorio</p>
        </Form>
    );
}
