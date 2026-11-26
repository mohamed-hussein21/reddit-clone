import { Link } from 'react-router-dom';
import { imageUrl } from '../../api/users.api';

export default function UserCard({ user }) {
    if (!user) {
        return null;
    }

    return (
        <Link
            className="user-card"
            to={'/user/' + user.username}
        >
            {user.avatar ? (
                <img
                    src={imageUrl(user.avatar)}
                    alt={user.username}
                />
            ) : (
                <div className="user-card-avatar">
                    {user.username[0].toUpperCase()}
                </div>
            )}

            <div>
                <strong>u/{user.username}</strong>
                <p>{user.karma} karma</p>
            </div>
        </Link>
    );
}