import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  clearSelectedEmployee,
  clearOperationStatus,
  selectSelectedEmployee,
  selectSelectedEmployeeStatus,
  selectOperationStatus,
} from '../features/employees/employeeSlice';
import {
  fetchCountries,
  selectCountries,
  selectCountriesStatus,
  selectCountriesError,
} from '../features/countries/countrySlice';
import EmployeeForm from '../components/employee/EmployeeForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const EmployeeFormContainer = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedEmployee = useSelector(selectSelectedEmployee);
  const selectedStatus = useSelector(selectSelectedEmployeeStatus);
  const operationStatus = useSelector(selectOperationStatus);

  const countries = useSelector(selectCountries);
  const countriesStatus = useSelector(selectCountriesStatus);
  const countriesError = useSelector(selectCountriesError);

  useEffect(() => {
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
  }, [dispatch, countriesStatus]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchEmployeeById(id));
    }
    return () => {
      dispatch(clearSelectedEmployee());
      dispatch(clearOperationStatus());
    };
  }, [dispatch, id, isEditMode]);

  const handleRetryCountries = () => dispatch(fetchCountries());

  const handleSubmit = async (values) => {
    try {
      if (isEditMode) {
        await dispatch(updateEmployee({ id, data: values })).unwrap();
        toast.success('Employee updated successfully.');
      } else {
        await dispatch(createEmployee(values)).unwrap();
        toast.success('Employee added successfully.');
      }
      navigate('/employees');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Something went wrong. Please try again.');
    }
  };

  if (isEditMode && selectedStatus === 'loading') {
    return (
      <div className="container pb-5">
        <LoadingSpinner label="Loading employee..." />
      </div>
    );
  }

  if (isEditMode && selectedStatus === 'failed') {
    return (
      <div className="container pb-5">
        <ErrorMessage message="Employee not found." />
        <Link to="/employees" className="btn btn-secondary mt-3">
          Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div className="container pb-5">
      <h1 className="h3 mb-4">{isEditMode ? 'Edit Employee' : 'Add Employee'}</h1>
      <EmployeeForm
        initialValues={isEditMode ? selectedEmployee : undefined}
        countries={countries}
        countriesStatus={countriesStatus}
        countriesError={countriesError}
        onRetryCountries={handleRetryCountries}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/employees')}
        submitting={operationStatus === 'loading'}
        submitLabel={isEditMode ? 'Update Employee' : 'Add Employee'}
      />
    </div>
  );
};

export default EmployeeFormContainer;
