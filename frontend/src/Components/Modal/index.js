import React from 'react';
import './Modal.css';

export default function Modal(props) {
  const { children, confirmText, onCancel, onConfirm, title } = props;
  return (
    <div className="modal">
      <header className="modal__header"><h1>{title}</h1></header>
      <section className="modal__content">
        {children}
      </section>
      <section className="modal__actions">
        {onCancel && <button className="btn" onClick={onCancel}>Cancel</button>}
        {onConfirm && <button className="btn" onClick={onConfirm}>{confirmText}</button>}
      </section>
    </div>
  );
}