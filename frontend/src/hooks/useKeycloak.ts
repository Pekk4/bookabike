// This file is mostly based on https://github.com/darkaico/keycloak-poc/blob/main/keycloak-web/src/hooks/useKeycloak.ts

import { useContext } from 'react';

import { KeycloakContext } from '@contexts/KeycloakContext';

const useKeycloak = () => {
  const context = useContext(KeycloakContext);

  if (!context) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }

  return context;
};

export default useKeycloak;
