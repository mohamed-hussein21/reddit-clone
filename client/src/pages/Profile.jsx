import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    getProfile,
    getUserPosts,
    getUserComments
} from '../api/users.api';

import ProfileHeader from '../components/user/ProfileHeader';


export default function Profile() {
    const { username } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [tab, setTab] = useState('posts');
    const [error, setError] = useState('');
    const [activityError, setActivityError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            setError('');
            setActivityError('');
            setProfile(null);
            setPosts([]);
            setComments([]);

            try {
                const data = await getProfile(username);
                setProfile(data);

                try {
                    setPosts(await getUserPosts(username));
                    setComments(await getUserComments(username));
                } catch (error) {
                    setActivityError(error.message);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [username]);

    async function handleLogout() {
        try {
            await logout();
        } finally {
            navigate('/login');
        }
    }

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p className="auth-error">{error}</p>;
    }

    if (!profile) {
        return null;
    }

    const isOwner = user && user._id === profile._id;

    return (
        <div className="profile-page">
            <ProfileHeader user={profile} isOwner={isOwner} />

            {isOwner && (
                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Log Out
                </button>
            )}

            <div className="profile-tabs">
                <button
                    className={tab === 'posts' ? 'active-tab' : ''}
                    onClick={() => setTab('posts')}
                >
                    Posts
                </button>

                <button
                    className={tab === 'comments' ? 'active-tab' : ''}
                    onClick={() => setTab('comments')}
                >
                    Comments
                </button>
            </div>

            {activityError && (
                <p className="auth-error">{activityError}</p>
            )}

            {tab === 'posts' && (
                <div>
                    {posts.length === 0 && !activityError && (
                        <p>No posts yet</p>
                    )}

                    {posts.map(post => (
                        <div className="profile-post" key={post._id}>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                            <span>{post.score} points</span>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'comments' && (
                <div>
                    {comments.length === 0 && !activityError && (
                        <p>No comments yet</p>
                    )}

                    {comments.map(comment => (
                        <div className="profile-post" key={comment._id}>
                            <p>{comment.body}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}