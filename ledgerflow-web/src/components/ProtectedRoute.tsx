import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but wrong role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    if (
      user.role === 'Employee'
    ) {
      return <Navigate to="/employee" replace />;
    }

    return <Navigate to="/accountant" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;