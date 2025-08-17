/**
 * This file is originally based on
 * https://github.com/darkaico/keycloak-poc/blob/main/keycloak-web/src/context/KeycloakContext.tsx
 *
 * but I've extended it to fit the needs of the application.
 */

import React, { createContext, useEffect, useState, useRef } from 'react';
import Keycloak from 'keycloak-js';

import { keycloackConfig, appRolesClaimName, appAdminRoleName } from '@constants';

interface KeycloakContextProps {
  keycloak: Keycloak | null;
  authenticated: boolean;
  profile?: Keycloak.KeycloakProfile;
  keycloakReady: boolean;
  isAdmin: boolean;
}

interface KeycloakProviderProps {
  children: React.ReactNode;
}

/**
 * KeycloakContext provides access to Keycloak instance and authentication state.
 * It includes the Keycloak instance, authentication status, user profile, readiness state,
 * and whether the user has admin privileges.
 */
const KeycloakContext = createContext<KeycloakContextProps | undefined>(undefined);

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const isRun = useRef<boolean>(false);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Keycloak.KeycloakProfile | undefined>(undefined);
  const [keycloakReady, setKeycloakReady] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;

    const initKeycloak = async () => {
      const keycloakInstance: Keycloak = new Keycloak(keycloackConfig);

      keycloakInstance
        .init({
          onLoad: 'check-sso',
        })
        .then((authenticated: boolean) => {
          setAuthenticated(authenticated);

          if (authenticated) {
            keycloakInstance.loadUserProfile().then((loadedProfile) => {
              setProfile(loadedProfile);
            });

            const roles = keycloakInstance.tokenParsed?.[appRolesClaimName] || [];
            setIsAdmin(roles.includes(appAdminRoleName));
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
        });
    };

    initKeycloak();
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, profile, keycloakReady, isAdmin }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export { KeycloakProvider, KeycloakContext };
