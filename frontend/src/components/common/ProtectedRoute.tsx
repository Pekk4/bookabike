import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import useModal from '@hooks/useModal';

interface ProtectedRouteProps {
  authenticated: boolean;
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that checks if the user is authenticated.
 * If not authenticated, it shows an error modal and redirects to the front page.
 * Used to wrap routes that require authentication, so authentication is checked
 * before rendering the children.
 *
 * @param authenticated - Boolean indicating if the user is authenticated.
 * @param children - The content to show if the user is authenticated.
 */
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
