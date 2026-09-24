import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import EmployeeListContainer from './containers/EmployeeListContainer';
import EmployeeFormContainer from './containers/EmployeeFormContainer';
import EmployeeSearchContainer from './containers/EmployeeSearchContainer';
import './App.css';

const Layout = () => (
  <div className="App">
    <Navbar />
    <Outlet />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/employees" replace /> },
      { path: 'employees', element: <EmployeeListContainer /> },
      { path: 'employees/add', element: <EmployeeFormContainer /> },
      { path: 'employees/edit/:id', element: <EmployeeFormContainer /> },
      { path: 'employees/search', element: <EmployeeSearchContainer /> },
      { path: '*', element: <Navigate to="/employees" replace /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
