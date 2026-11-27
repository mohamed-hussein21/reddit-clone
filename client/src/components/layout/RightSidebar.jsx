import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { getModerators } from '../../api/moderation.api';
import '../../styles/sidebar.css';

// Community "About" card (description, members, rules, moderators).
// Without a community it shows a simple home card.
export default function RightSidebar({ community }) {
  const [moderators, setModerators] = useState([]);

  useEffect(() => {
    if (!community?._id) return;

    getModerators(community._id)
      .then(setModerators)
      .catch(() => setModerators([]));
  }, [community?._id]);

  if (!community) {
    return (
      <aside className="right-sidebar">
        <div className="sidebar-card">
          <h3>Home</h3>
          <p>
            Your personal Reddit frontpage. Come here to check in with your favorite communities.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="right-sidebar">
      <div className="sidebar-card">
        <h2 className="sidebar-name">r/{community.name}</h2>
        {community.title && <p className="sidebar-title">{community.title}</p>}
        {community.description && <p>{community.description}</p>}

        <div className="sidebar-stats">
          {community.membersCount !== undefined && (
            <div>
              <strong>{community.membersCount}</strong>
              <span>Members</span>
            </div>
          )}
          {community.createdAt && (
            <div>
              <strong>{dayjs(community.createdAt).format('MMM D, YYYY')}</strong>
              <span>Created</span>
            </div>
          )}
        </div>
      </div>

      {community.rules?.length > 0 && (
        <div className="sidebar-card">
          <h3>Rules</h3>
          <ol className="sidebar-rules">
            {community.rules.map((rule, index) => (
              <li key={rule._id || index}>
                <strong>{rule.title}</strong>
                {rule.description && <p>{rule.description}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="sidebar-card">
        <h3>Moderators</h3>
        {moderators.length === 0 ? (
          <p className="muted">No moderators</p>
        ) : (
          <ul className="sidebar-mods">
            {moderators.map((mod) => (
              <li key={mod._id}>
                <Link to={`/user/${mod.username}`}>u/{mod.username}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
