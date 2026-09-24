import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployees,
  deleteEmployee,
  selectEmployees,
  selectEmployeeListStatus,
  selectEmployeeListError,
} from '../features/employees/employeeSlice';
import EmployeeTable from '../components/employee/EmployeeTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';

const EmployeeListContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employees = useSelector(selectEmployees);
  const listStatus = useSelector(selectEmployeeListStatus);
  const listError = useSelector(selectEmployeeListError);

  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadEmployees = useCallback(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
  };

  const handleCancelDelete = () => {
    setEmployeeToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    setDeleting(true);
    try {
      await dispatch(deleteEmployee(employeeToDelete.id)).unwrap();
      toast.success(`"${employeeToDelete.name}" was deleted successfully.`);
      setEmployeeToDelete(null);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to delete employee. Please try again.');
      // Keep the modal open with the employee still in the list so the
      // user can see the error and retry or cancel.
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container pb-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="h3 mb-0">Employees</h1>
        <Link to="/employees/add" className="btn btn-primary">
          Add Employee
        </Link>
      </div>

      {listStatus === 'loading' && <LoadingSpinner label="Loading employees..." />}

      {listStatus === 'failed' && <ErrorMessage message={listError} onRetry={loadEmployees} />}

      {listStatus === 'succeeded' && employees.length === 0 && (
        <EmptyState message="No employees found." actionLabel="Add Employee" onAction={() => navigate('/employees/add')} />
      )}

      {listStatus === 'succeeded' && employees.length > 0 && (
        <EmployeeTable employees={employees} onDelete={handleDeleteClick} />
      )}

      <DeleteConfirmationModal
        show={Boolean(employeeToDelete)}
        employeeName={employeeToDelete?.name}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
};

export default EmployeeListContainer;
