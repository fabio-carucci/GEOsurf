import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import RegisterFormForUsers from './RegisterFormForUsers';
import RegisterFormForCompany from './RegisterFormForCompany';
import { useAuth } from '../../context/AuthContextProvider';

export default function RegisterForm({ onHide, setIsRegistering }) {
    const [userType, setUserType] = useState('');

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    const renderForm = () => {
        if (userType === 'user') {
            return <RegisterFormForUsers onHide={onHide} setIsRegistering={setIsRegistering}/>;
        } else if (userType === 'company') {
            return <RegisterFormForCompany onHide={onHide} setIsRegistering={setIsRegistering}/>;
        }
        return null;
    };

    return (
        <>
            <Form>
                <Form.Group controlId="userType">
                    <Form.Label>Ti pongo una domanda: sei un utente o una scuola di surf?</Form.Label>
                    <div>
                        <Form.Check
                            type="radio"
                            id="userRadio"
                            label="Utente"
                            name="userType"
                            value="user"
                            onChange={handleUserTypeChange}
                            checked={userType === 'user'}
                        />
                        <Form.Check
                            type="radio"
                            id="companyRadio"
                            label="Scuola di surf"
                            name="userType"
                            value="company"
                            onChange={handleUserTypeChange}
                            checked={userType === 'company'}
                        />
                    </div>
                </Form.Group>
            </Form>
            {renderForm()}
        </>
    );
}