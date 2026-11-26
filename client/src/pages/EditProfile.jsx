import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    updateProfile,
    uploadAvatar,
    imageUrl
} from '../api/users.api';



export default function EditProfile() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState(
        user.displayName || ''
    );

    const [bio, setBio] = useState(user.bio || '');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const updatedUser = await updateProfile(displayName, bio);

            setUser(old => ({ ...old, ...updatedUser }));

            if (file) {
                const uploadedUser = await uploadAvatar(file);

                setUser(old => ({ ...old, ...uploadedUser }));
            }

            navigate('/user/' + user.username);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="edit-profile-page">
            <form onSubmit={handleSubmit}>
                <h1>Profile Settings</h1>

                {error && <p className="auth-error">{error}</p>}

                <label htmlFor="avatar">Profile Picture</label>

                {user.avatar && (
                    <img
                        className="edit-avatar"
                        src={imageUrl(user.avatar)}
                        alt="Profile"
                    />
                )}

                <input
                    id="avatar"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={e => setFile(e.target.files[0])}
                />

                <label htmlFor="displayName">Display Name</label>

                <input
                    id="displayName"
                    type="text"
                    maxLength={30}
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                />

                <label htmlFor="bio">About</label>

                <textarea
                    id="bio"
                    maxLength={200}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                />

                <button
                    className="profile-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}