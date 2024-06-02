import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContextProvider';
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function RegisterFormForUsers({ onHide, setIsRegistering }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);

    const { login } = useAuth();

    const apiURL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        if (password !== confirmPassword) {
            setError('Le password non coincidono.');
            return;
        }

        // Rimuovi confirmPassword dal formData
        formData.delete('confirmPassword');

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${apiURL}/auth/createUser`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                console.log('Registration successful', data.token);
                onHide();
                login(data.token, 'user');
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


    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNome">
                <Form.Label>Nome <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="nome" placeholder="Inserisci nome" required />
            </Form.Group>

            <Form.Group controlId="formCognome" className='mt-2'>
                <Form.Label>Cognome <span className="text-danger">*</span></Form.Label>
                <Form.Control type="text" name="cognome" placeholder="Inserisci cognome" required />
            </Form.Group>

            <Form.Group controlId="formEmail" className='mt-2'>
                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                <Form.Control type="email" name="email" placeholder="Inserisci email" required />
            </Form.Group>

            <Form.Group controlId="formPassword" className='mt-2'>
                <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                <InputGroup>
                    <Form.Control 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        placeholder="Password" 
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
                        placeholder="Conferma Password" 
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

            <div className="text-center">
                <Button variant="outline-primary" className="mt-2 px-4" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Crea account'}
                </Button>
            </div>

            {error && <p className="text-danger mt-2">{error}</p>}
            <p className="text-muted mt-2"><span className="text-danger">*</span> Obbligatorio</p>
        </Form>
    );
}