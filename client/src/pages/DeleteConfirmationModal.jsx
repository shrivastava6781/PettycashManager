import React, { useState, useEffect } from 'react';

const DeleteConfirmationModal = ({ isOpen, itemName, onDelete, onClose, deleteReason, setDeleteReason }) => {
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    if (isOpen) {
      setDeleteReason(''); // Reset deleteReason to an empty string
      setError(null); // Reset error state when modal opens
    }
  }, [isOpen, setDeleteReason]);

  const handleDelete = async () => {
    try {
      await onDelete(deleteReason); // Pass deletion reason to onDelete function
      onClose(); // Close the modal after deletion
    } catch (error) {
      setError(error.message || 'An error occurred while deleting.'); // Handle error if deletion fails
    }
  };

  return (
    <div className={`modal fade ${isOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog modal-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#00509d', color: 'white' }}>
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="button_details" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="modal-body d-flex flex-column align-items-center justify-content-center" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <h6 className="fw-bolder text-black m-0">
              Are you sure you want to delete the Name: <strong>{itemName}</strong>?
            </h6>
            <h6 className="fw-bolder m-0 text-danger p-2">
              Once you delete this data, you cannot retrieve it.
            </h6>
            {error && <p className="invalid-feedback">{error}</p>} {/* Display error message if any */}
          </div>
          <div className="modal-footer" style={{ backgroundColor: '#00509d', color: 'white' }}>
            <button type="button" className="button_details" onClick={handleDelete}>Confirm Delete</button>
            <button type="button" className="button_details" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

