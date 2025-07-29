import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import AppRoutes from './AppRoutes';
import ErrorBoundary from './context/ErrorBoundary';
import { ModalProvider } from './context/ModalContext';
import useModal from './hooks/useModal';
import useKeycloak from './hooks/useKeycloak';
import MenuBar from './components/MenuBar';
import Modal from './components/Modal';
import LoadingView from './components/LoadingView';
import BaseLayout from './components/BaseLayout';

const ModalRoot = () => {
  const { content, buttonMode, hideModal, confirmHandler, cancelHandler, errorMode } = useModal();

  return (
    <Modal
      content={content}
      buttonMode={buttonMode}
      confirmHandler={confirmHandler}
      closingHandler={cancelHandler || hideModal}
      errorMode={errorMode}
    />
  );
};

// Close modal automatically when navigating to a different page
const ModalAutoCloser = () => {
  const location = useLocation();
  const { hideModal } = useModal();

  useEffect(() => {
    // Keep the modal open only, if it's about "login required"
    if (!location.state?.loginRequired) {
      hideModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

function App() {
  const { authenticated, keycloakReady } = useKeycloak();

  // Show loading spinner until Keycloak session is ready
  if (!keycloakReady) {
    return <LoadingView />;
  }

  //useEffect(() => {
  //  void axios.get<void>(`http://localhost:3000/api/ping`); // TODO
  //}, []);

  return (
    <>
      <ErrorBoundary>
        <ModalProvider>
          <ModalRoot />
          <Router>
            <ModalAutoCloser />
            <BaseLayout>
              <AppRoutes authenticated={authenticated} />
            </BaseLayout>
            <MenuBar />
          </Router>
        </ModalProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
