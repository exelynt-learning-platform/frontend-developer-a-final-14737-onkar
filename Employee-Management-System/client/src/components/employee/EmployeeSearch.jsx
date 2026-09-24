import React, { useState } from 'react';
import { validateEmployeeId } from '../../utils/validation';

const EmployeeSearch = ({ onSearch, onClear, loading }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validateEmployeeId(id);
    setError(validationError);
    if (validationError) return;
    onSearch(id.trim());
  };

  const handleClear = () => {
    setId('');
    setError('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="row g-2 align-items-end" aria-label="Search employee by ID">
      <div className="col-sm-6 col-md-4">
        <label htmlFor="employee-search-id" className="form-label">
          Employee ID <span aria-hidden="true">*</span>
          <span className="visually-hidden">required</span>
        </label>
        <input
          type="text"
          id="employee-search-id"
          name="employeeId"
          className={`form-control${error ? ' is-invalid' : ''}`}
          placeholder="Enter employee ID"
          value={id}
          onChange={(event) => setId(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby="employee-search-id-error"
        />
        {error && (
          <div id="employee-search-id-error" className="invalid-feedback d-block">
            {error}
          </div>
        )}
      </div>
      <div className="col-auto d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={handleClear} disabled={loading}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default EmployeeSearch;
