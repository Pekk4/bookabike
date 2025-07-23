import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import MenuBar from './components/MenuBar';
import ErrorBoundary from './context/ErrorBoundary';
import AppRoutes from './AppRoutes';
import Modal from './components/Modal';
import { ModalProvider } from './context/ModalContext';
import useModal from './hooks/useModal';
import { useLocation } from 'react-router-dom';
import useKeycloak from './hooks/useKeycloak';
import LoadingView from './components/LoadingView';
import BaseLayout from './components/BaseLayout';

const ModalRoot = () => {
  const { content, buttonMode, hideModal, confirmHandler, cancelHandler } = useModal();
  return (
    <Modal
      message={content}
      mode={buttonMode}
      confirmHandler={confirmHandler}
      cancelHandler={cancelHandler || hideModal}
    />
  );
};

const ModalAutoCloser = () => {
  const location = useLocation();
  const { hideModal } = useModal();

  useEffect(() => {
    hideModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

function App() {
  const { authenticated, keycloakReady } = useKeycloak();

  if (!keycloakReady) {
    return <LoadingView />;
  }

  //useEffect(() => {
  //  void axios.get<void>(`http://localhost:3000/api/ping`); // TO BE DELETED...
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
            {/* Modal wont cover menubar with router anymore // TODO: check out*/}
            <MenuBar />
            {/*<HomeDemo />*/}
          </Router>
        </ModalProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
