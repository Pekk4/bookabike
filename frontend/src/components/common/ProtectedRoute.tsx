import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import useModal from '@hooks/useModal';
import { getPleaseLoginMessage } from '@utils/modalMessages';
import { ModalButtonMode } from '@types';

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
      showModal(getPleaseLoginMessage(), ModalButtonMode.OkButton, undefined, undefined, true);
    }
    // We can't put showModal as a dependency here, because it causes an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (!authenticated) {
    return <Navigate to="/" replace state={{ loginRequired: true }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
