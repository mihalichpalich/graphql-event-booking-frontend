import React from "react";

import './Modal.css';

const modal = ({title, children, canCancel, canConfirm, onCancel, onConfirm}) => (
    <div className="modal">
        <header className="modal__header">{title}</header>
        <section className="modal__content">{children}</section>
        <section className="modal__actions">
            {canCancel && <button className="btn" onClick={onCancel}>Cancel</button>}
            {canConfirm && <button className="btn" onClick={onConfirm}>Confirm</button>}
        </section>
    </div>
);

export default modal;