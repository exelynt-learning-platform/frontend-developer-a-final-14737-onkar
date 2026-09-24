import React from 'react';
import { Link } from 'react-router-dom';
import './EmployeeTable.css';

const EmployeeTable = ({ employees, onDelete }) => (
  <div className="employee-table-wrapper">
    <table className="table table-striped table-bordered employee-table">
      <caption className="visually-hidden">List of employees</caption>
      <thead>
        <tr>
          <th scope="col">Employee ID</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Mobile</th>
          <th scope="col">Country</th>
          <th scope="col">State</th>
          <th scope="col">District</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td data-label="Employee ID">{employee.id}</td>
            <td data-label="Name">{employee.name}</td>
            <td data-label="Email">{employee.email}</td>
            <td data-label="Mobile">{employee.mobile}</td>
            <td data-label="Country">{employee.country}</td>
            <td data-label="State">{employee.state}</td>
            <td data-label="District">{employee.district}</td>
            <td data-label="Actions" className="employee-actions">
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <Link
                  to={`/employees/edit/${employee.id}`}
                  className="btn btn-sm btn-info"
                  aria-label={`Edit ${employee.name}`}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(employee)}
                  aria-label={`Delete ${employee.name}`}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;
