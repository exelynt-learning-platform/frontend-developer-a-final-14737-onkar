import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-danger ms-3" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
