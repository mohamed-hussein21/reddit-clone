export default function Tabs(props) {
  return (
    <div className="tabs">
      {props.items.map((item) => (
        <button
          key={item}
          className={props.activeTab === item ? 'active' : ''}
          onClick={() => props.onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}