import { useState } from 'react';

export default function Dropdown(props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <button onClick={() => setIsOpen(!isOpen)}>
        {props.label}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {props.items.map((item) => (
            <button key={item}>{item}</button>
          ))}
        </div>
      )}
    </div>
  );
}