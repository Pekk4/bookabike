export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const maxBookingLength = 3; // Maximum number of days for a booking, starting from 0

export const statusTranslations: Record<string, string> = {
  pending: 'Odottaa',
  confirmed: 'Hyväksytty',
  canceled: 'Peruttu (käyttäjä)',
  wished: 'Toive',
  rejected: 'Varaus evätty',
  revoked: 'Peruttu (admin)',
};

export const keycloackConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL as string,
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT as string,
};

// JWT claim name, which contains the application roles
export const appRolesClaimName =
  (import.meta.env.VITE_BOOKABIKE_JWT_ROLES_CLAIM_NAME as string) || 'bookabike-roles';

// JWT role name for the admin role
export const appAdminRoleName =
  (import.meta.env.VITE_BOOKABIKE_JWT_ADMIN_ROLE_NAME as string) || 'bookabike-admin';
