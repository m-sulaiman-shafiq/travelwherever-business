import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AccountantDashboard from './pages/AccountantDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const defaultRoute = user.role === 'Employee' ? '/employee' : '/accountant';

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to={defaultRoute} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accountant"
          element={
            <ProtectedRoute allowedRoles={['Owner', 'Accountant']}>
              <AccountantDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
