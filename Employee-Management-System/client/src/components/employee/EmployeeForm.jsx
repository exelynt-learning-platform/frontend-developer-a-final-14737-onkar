import React, { useEffect, useState } from 'react';
import { validateEmployeeForm, isFormValid } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const EMPTY_VALUES = { name: '', email: '', mobile: '', country: '', state: '', district: '' };

const EmployeeForm = ({
  initialValues,
  countries,
  countriesStatus,
  countriesError,
  onRetryCountries,
  onSubmit,
  onCancel,
  submitting,
  submitLabel = 'Save',
}) => {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateEmployeeForm({ ...values }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateEmployeeForm(values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, mobile: true, country: true, state: true, district: true });
    if (!isFormValid(validationErrors)) {
      return;
    }
    onSubmit(values);
  };

  const handleReset = () => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
    setErrors({});
    setTouched({});
  };

  const fieldError = (field) => (touched[field] ? errors[field] : '');

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Employee form">
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">
            Name <span aria-hidden="true">*</span>
            <span className="visually-hidden">required</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control${fieldError('name') ? ' is-invalid' : ''}`}
            placeholder="Enter full name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('name'))}
            aria-describedby="name-error"
            required
          />
          {fieldError('name') && (
            <div id="name-error" className="invalid-feedback">
              {fieldError('name')}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email <span aria-hidden="true">*</span>
            <span className="visually-hidden">required</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control${fieldError('email') ? ' is-invalid' : ''}`}
            placeholder="name@example.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('email'))}
            aria-describedby="email-error"
            required
          />
          {fieldError('email') && (
            <div id="email-error" className="invalid-feedback">
              {fieldError('email')}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="mobile" className="form-label">
            Mobile <span aria-hidden="true">*</span>
            <span className="visually-hidden">required</span>
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            className={`form-control${fieldError('mobile') ? ' is-invalid' : ''}`}
            placeholder="10-digit mobile number"
            value={values.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('mobile'))}
            aria-describedby="mobile-error"
            maxLength={10}
            required
          />
          {fieldError('mobile') && (
            <div id="mobile-error" className="invalid-feedback">
              {fieldError('mobile')}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="country" className="form-label">
            Country <span aria-hidden="true">*</span>
            <span className="visually-hidden">required</span>
          </label>
          {countriesStatus === 'loading' && <LoadingSpinner label="Loading countries..." size="sm" />}
          {countriesStatus === 'failed' && (
            <ErrorMessage message={countriesError || 'Unable to load countries.'} onRetry={onRetryCountries} />
          )}
          {countriesStatus !== 'loading' && countriesStatus !== 'failed' && (
            <select
              id="country"
              name="country"
              className={`form-select${fieldError('country') ? ' is-invalid' : ''}`}
              value={values.country}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={Boolean(fieldError('country'))}
              aria-describedby="country-error"
              required
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          )}
          {fieldError('country') && (
            <div id="country-error" className="invalid-feedback d-block">
              {fieldError('country')}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="state" className="form-label">
            State <span aria-hidden="true">*</span>
            <span className="visually-hidden">required</span>
          </label>
          <input
            type="text"
            id="state"
            name="state"
            className={`form-control${fieldError('state') ? ' is-invalid' : ''}`}
            placeholder="Enter state"
            value={values.state}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('state'))}
            aria-describedby="state-error"
            required
          />
          {fieldError('state') && (
            <div id="state-error" className="invalid-feedback">
              {fieldError('state')}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="district" className="form-label">
            District <span aria-hidden="true">*</span>
            <span className="visually-hidden">required</span>
          </label>
          <input
            type="text"
            id="district"
            name="district"
            className={`form-control${fieldError('district') ? ' is-invalid' : ''}`}
            placeholder="Enter district"
            value={values.district}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={Boolean(fieldError('district'))}
            aria-describedby="district-error"
            required
          />
          {fieldError('district') && (
            <div id="district-error" className="invalid-feedback">
              {fieldError('district')}
            </div>
          )}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={submitting}>
          Reset
        </button>
        {onCancel && (
          <button type="button" className="btn btn-link" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;
