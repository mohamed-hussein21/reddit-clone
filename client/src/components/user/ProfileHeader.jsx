import { Link } from 'react-router-dom';
import { imageUrl } from '../../api/users.api';

export default function ProfileHeader({ user, isOwner }) {
    return (
        <div className="profile-header">
            <div
                className="profile-banner"
                style={{
                    backgroundImage: user.banner
                        ? `url("${imageUrl(user.banner)}")`
                        : 'none'
                }}
            />

            <div className="profile-information">
                {user.avatar ? (
                    <img
                        className="profile-avatar"
                        src={imageUrl(user.avatar)}
                        alt={user.username}
                    />
                ) : (
                    <div className="profile-avatar avatar-placeholder">
                        {user.username[0].toUpperCase()}
                    </div>
                )}

                <h1>{user.displayName || user.username}</h1>

                <p>u/{user.username}</p>

                <p>{user.bio || 'No bio yet'}</p>

                <div className="profile-stats">
                    <div>
                        <strong>{user.karma}</strong>
                        <p>Karma</p>
                    </div>

                    <div>
                        <strong>
                            {new Date(user.createdAt).toLocaleDateString()}
                        </strong>
                        <p>Cake day</p>
                    </div>
                </div>

                {isOwner && (
                    <Link
                        className="profile-button"
                        to="/settings/profile"
                    >
                        Edit Profile
                    </Link>
                )}
            </div>
        </div>
    );
}