import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSessionId } from '../utils/session';
import './Login.css';

const Login = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const sessionId = generateSessionId(firstName, lastName, dob);
        // Use sessionId as needed
        navigate('/chat', { state: { sessionId } });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;