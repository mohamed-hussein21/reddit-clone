import { BsStars } from 'react-icons/bs';
import { FiTrendingUp } from 'react-icons/fi';

const OPTIONS = [
  { value: 'new', label: 'New', icon: BsStars },
  { value: 'top', label: 'Top', icon: FiTrendingUp },
];

// "New / Top" buttons above the posts
export default function SortBar({ sort, onChange }) {
  return (
    <div className="sort-bar">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className={`sort-btn ${sort === value ? 'active' : ''}`}
          onClick={() => onChange(value)}
        >
          <Icon /> {label}
        </button>
      ))}
    </div>
  );
}
