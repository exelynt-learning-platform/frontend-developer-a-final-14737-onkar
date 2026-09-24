import React from 'react';
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) => `nav-link${isActive ? ' active fw-semibold' : ''}`;

const Navbar = () => (
  <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4" aria-label="Main navigation">
    <div className="container">
      <span className="navbar-brand mb-0 h1">Employee Management</span>
      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink to="/employees" className={linkClass} end>
              Employees
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/employees/search" className={linkClass}>
              Search
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/employees/add" className={linkClass}>
              Add Employee
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
