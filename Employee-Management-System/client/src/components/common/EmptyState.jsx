import React from 'react';

const EmptyState = ({ message, actionLabel, onAction }) => (
  <div className="text-center py-5 text-muted" role="status">
    <p className="mb-3 fs-5">{message}</p>
    {actionLabel && onAction && (
      <button type="button" className="btn btn-primary" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
