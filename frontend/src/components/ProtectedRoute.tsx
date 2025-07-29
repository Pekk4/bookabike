import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import useModal from '../hooks/useModal';

interface ProtectedRouteProps {
  authenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute = ({ authenticated, children }: ProtectedRouteProps) => {
  const { showModal } = useModal();

  useEffect(() => {
    if (!authenticated) {
      showModal('Kirjaudu sisään nähdäksesi tämän sivun.', 'ok', undefined, undefined, true);
    }
  }, [authenticated, showModal]);

  if (!authenticated) {
    return <Navigate to="/" replace state={{ loginRequired: true }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
