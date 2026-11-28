import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <Link className="navbar-logo" to="/">reddit</Link>

      <div className="navbar-search">
        <input type="search" placeholder="Search Reddit" />
      </div>

      <div className="navbar-links">
        {user && <Link to={`/user/${user.username}`}>Profile</Link>}
        {user && <Link to="/submit"><strong>+ Create</strong></Link>}
        {!user && (<Link className="navbar-login" to="/login"> Log In</Link>)}
        {!user && <Link to="/register">Sign Up</Link>}
      </div>
    </nav>
  );
}