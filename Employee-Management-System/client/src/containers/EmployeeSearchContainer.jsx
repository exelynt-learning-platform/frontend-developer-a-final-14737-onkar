import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  searchEmployeeById,
  clearSearchResult,
  selectSearchResult,
  selectSearchStatus,
  selectSearchError,
} from '../features/employees/employeeSlice';
import EmployeeSearch from '../components/employee/EmployeeSearch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const EmployeeSearchContainer = () => {
  const dispatch = useDispatch();
  const result = useSelector(selectSearchResult);
  const status = useSelector(selectSearchStatus);
  const error = useSelector(selectSearchError);

  const handleSearch = (id) => {
    dispatch(searchEmployeeById(id));
  };

  const handleClear = () => {
    dispatch(clearSearchResult());
  };

  return (
    <div className="container pb-5">
      <h1 className="h3 mb-4">Search Employee</h1>
      <EmployeeSearch onSearch={handleSearch} onClear={handleClear} loading={status === 'loading'} />

      <div className="mt-4">
        {status === 'loading' && <LoadingSpinner label="Searching..." />}

        {status === 'failed' && (
          <ErrorMessage message={error || 'Unable to search employee. Please try again.'} />
        )}

        {status === 'not-found' && <EmptyState message="Employee not found." />}

        {status === 'succeeded' && result && (
          <div className="card">
            <div className="card-body">
              <h2 className="h5 card-title">{result.name}</h2>
              <dl className="row mb-0">
                <dt className="col-sm-3">Employee ID</dt>
                <dd className="col-sm-9">{result.id}</dd>
                <dt className="col-sm-3">Email</dt>
                <dd className="col-sm-9">{result.email}</dd>
                <dt className="col-sm-3">Mobile</dt>
                <dd className="col-sm-9">{result.mobile}</dd>
                <dt className="col-sm-3">Country</dt>
                <dd className="col-sm-9">{result.country}</dd>
                <dt className="col-sm-3">State</dt>
                <dd className="col-sm-9">{result.state}</dd>
                <dt className="col-sm-3">District</dt>
                <dd className="col-sm-9 mb-0">{result.district}</dd>
              </dl>
              <Link to={`/employees/edit/${result.id}`} className="btn btn-sm btn-info mt-3">
                Edit
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearchContainer;
