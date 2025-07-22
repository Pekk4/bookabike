import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  authenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute = ({ authenticated, children }: ProtectedRouteProps) => {
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
