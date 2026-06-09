import React, { useEffect, useRef } from 'react';
import './InfoModal.css';

const InfoModal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="info-modal-overlay">
      <div className="info-modal-content" ref={modalRef}>
        <div className="info-modal-header">
          <h3>{title}</h3>
          <button className="info-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="info-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
