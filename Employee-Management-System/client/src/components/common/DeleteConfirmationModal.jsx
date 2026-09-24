import React, { useEffect, useRef } from 'react';

const DeleteConfirmationModal = ({ show, employeeName, onCancel, onConfirm, loading }) => {
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (show && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onCancel]);

  if (!show) return null;

  return (
    <>
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-title"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="delete-confirmation-title">
                Confirm Deletion
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
                disabled={loading}
              />
            </div>
            <div className="modal-body">
              <p className="mb-0">
                Are you sure you want to delete{employeeName ? ` "${employeeName}"` : ' this employee'}?
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={loading}
                ref={confirmButtonRef}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
};

export default DeleteConfirmationModal;
