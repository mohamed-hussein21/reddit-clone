export default function Modal(props) {
  if (!props.isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <p>{props.message}</p>
      <button onClick={props.onClose}>Close</button>
    </div>
  );
}