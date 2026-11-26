import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
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

                <h1>Log In</h1>
                <p>Welcome back to Reddit.</p>

                {error && <p className="auth-error">{error}</p>}

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
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>

                <p>
                    New to Reddit? <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}