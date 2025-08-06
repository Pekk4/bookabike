import React, { createContext, useEffect, useState, useRef } from 'react';
import Keycloak from 'keycloak-js';

interface KeycloakContextProps {
  keycloak: Keycloak | null;
  authenticated: boolean;
  // admin: boolean; // JUST FOR TESTING, TODO: REMOVE
  profile?: Keycloak.KeycloakProfile;
  keycloakReady: boolean;
  isAdmin: boolean; // JUST FOR TESTING, TODO: REMOVE
}

interface KeycloakProviderProps {
  children: React.ReactNode;
}

const KeycloakContext = createContext<KeycloakContextProps | undefined>(undefined);

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const isRun = useRef<boolean>(false);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // JUST FOR TESTING, TODO: REMOVE
  const [profile, setProfile] = useState<Keycloak.KeycloakProfile | undefined>(undefined);
  const [keycloakReady, setKeycloakReady] = useState(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;

    const initKeycloak = async () => {
      const keycloackConfig = {
        url: import.meta.env.VITE_KEYCLOAK_URL as string,
        realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT as string,
      };
      const keycloakInstance: Keycloak = new Keycloak(keycloackConfig);

      //console.log("KCI: ", keycloakInstance);
      // DELETE

      // https://er-raj-aryan.medium.com/fixing-keycloak-auto-redirect-on-refresh-a-complete-guide-to-persistent-authentication-in-spas-8f0688f074d5

      // https://er-raj-aryan.medium.com/fixing-keycloak-auto-redirect-on-refresh-how-to-persist-authentication-in-spas-5aec92319b51

      keycloakInstance
        .init({
          onLoad: 'check-sso',
        })
        .then((authenticated: boolean) => {
          setAuthenticated(authenticated);
          //console.log('login-objekti: ', keycloakInstance.tokenParsed);
          if (authenticated) {
            keycloakInstance.loadUserProfile().then((loadedProfile) => {
              setProfile(loadedProfile);
            });
            //setKeycloakReady(true);
            const roles = keycloakInstance.tokenParsed?.['bookabike-roles'] || [];
            setIsAdmin(roles.includes('bookabike-admin'));
          }
        })
        .catch((error) => {
          console.error('Keycloak initialization failed:', error);
          setAuthenticated(false);
          setKeycloakReady(false);
        })
        .finally(() => {
          setKeycloak(keycloakInstance);
          setKeycloakReady(true);
          //setAdmin(true); // JUST FOR TESTING, TODO: REMOVE
          //console.log('keycloak', keycloakInstance);
        });
    };

    initKeycloak();
  }, []);

  return (
    // <KeycloakContext.Provider value={{ keycloak, authenticated, admin }}>
    <KeycloakContext.Provider value={{ keycloak, authenticated, profile, keycloakReady, isAdmin }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export { KeycloakProvider, KeycloakContext };
