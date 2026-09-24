import React from 'react';

const LoadingSpinner = ({ label = 'Loading...', size }) => {
  const spinnerClass = size === 'sm' ? 'spinner-border spinner-border-sm' : 'spinner-border';
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-4" role="status" aria-live="polite">
      <span className={spinnerClass} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
