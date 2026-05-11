import React, { useState } from 'react';
import { login } from '../api/authService';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            onLoginSuccess();
        } catch (err) {
            console.error(err);
            alert("Błąd logowania");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nazwa użytkownika" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Hasło" />
            <button type="submit">Zaloguj się</button>
        </form>
    );
};

export default Login;