import React from 'react';
import { Button } from 'react-bootstrap';

export default function GoogleLoginButton() {

    const apiURL = process.env.REACT_APP_API_URL;

    const handleGoogleLoginClick = () => {
        const googleAuthUrl = `${apiURL}/auth/googleLogin`;
        window.open(googleAuthUrl, "_self");
    };

    return (
        <div>
            <Button variant="outline-danger" className="mt-2" onClick={handleGoogleLoginClick}>
                Accedi con Google
            </Button>
        </div>
    )
}