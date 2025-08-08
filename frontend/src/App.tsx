import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import AppRoutes from './AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ModalProvider } from './contexts/ModalContext';
import useModal from './hooks/useModal';
import useKeycloak from './hooks/useKeycloak';
import MenuBar from './components/common/MenuBar';
import Modal from './components/common/Modal';
import LoadingView from './components/common/LoadingView';
import BaseLayout from './components/common/BaseLayout';
import theme from './theme';

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
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
