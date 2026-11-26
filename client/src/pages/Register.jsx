import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await register(username, email, password);
            navigate('/user/' + user.username);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <Link to="/" className="auth-logo">reddit</Link>

                <h1>Sign Up</h1>
                <p>Create your Reddit account.</p>

                {error && <p className="auth-error">{error}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    aria-label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    minLength={3}
                    maxLength={20}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    minLength={8}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Sign Up'}
                </button>

                <p>
                    Already a Redditor? <Link to="/login">Log In</Link>
                </p>
            </form>
        </div>
    );
}