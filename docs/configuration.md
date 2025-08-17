# Application Configuration

This document provides an overview of the configuration settings required for the application to function correctly, including Keycloak integration, database setup, and other environment-specific settings.

## Frontend Configuration

Frontend configuration lives in `src/constants.ts` file. There are the configuration settings for the bookings maximum duration, timestamp locales and translations, Keycloak config and application roles.

### Frontend environment variables

The frontend uses the following environment variables:

- `VITE_API_BASE_URL`: The base URL for the backend API, e.g. `https://example.com/api` (without a trailing slash).
- `VITE_KEYCLOAK_URL`: The URL of the Keycloak server, e.g. `https://keycloak.example.com`.
- `VITE_KEYCLOAK_REALM`: The Keycloak realm name, e.g. `bookabike`.
- `VITE_KEYCLOAK_CLIENT`: The Keycloak client ID for the frontend, e.g. `bookabike-frontend`. See the application's Keycloak documentation for more details.
- `VITE_BOOKABIKE_JWT_ROLES_CLAIM_NAME`: The claim name to seek the application roles in the access token, e.g. `bookabike-roles`. This should match the claim name configured in Keycloak, see the application's Keycloak documentation for more details.
- `VITE_BOOKABIKE_JWT_ADMIN_ROLE_NAME`: The name of the admin role, e.g. `bookabike-admin`. This should match the admin role name configured in Keycloak, see the application's Keycloak documentation for more details.

## Backend Configuration

Backend configuration lives in `utils/config.go` file. There are all the configuration settings for the backend, including database connection, Keycloak integration, and other environment-specific settings. They are all set via environment variables, or some default values are used if the config is not critical and not set.

### Backend environment variables

The backend uses the following environment variables:

- `PORT`: The port on which the backend server listens, e.g. `3000`. Default is set to `3000`.
- `DB_HOST`: The hostname of the database server, e.g. `postgres`. Default is set to `localhost` for local development.
- `DB_PORT`: The port on which the database server listens, e.g. `5432`. Default is set to `5432`.
- `DB_SSLMODE`: The SSL mode for the database connection, e.g. `disable` for local development. Default is set to `disable`.
- `DB_USER`: The username for the database connection, e.g. `bookabike`.
- `DB_PASSWORD`: The password for the database connection.
- `DB_NAME`: The name of the database, e.g. `bookabike`.
- `KEYCLOAK_BASE_URL`: The base URL of the Keycloak server, e.g. `http://localhost:8080` for local development.
- `KEYCLOAK_REALM`: The Keycloak realm name, e.g. `bookabike`.
- `KEYCLOAK_CLIENT_ID`: The Keycloak client ID for the backend, e.g. `bookabike-backend`. This should match the backend client ID configured in Keycloak, see the application's Keycloak documentation for more details.
- `KEYCLOAK_CLIENT_SECRET`: The Keycloak client secret for the backend. This should match the backend client secret configured in Keycloak, see the application's Keycloak documentation for more details.
- `BOOKABIKE_JWT_ROLES_CLAIM_NAME`: The claim name to seek the application roles in the access token, e.g. `bookabike-roles`. This should match the claim name configured in Keycloak, see the application's Keycloak documentation for more details.
- `BOOKABIKE_JWT_ADMIN_ROLE_NAME`: The name of the admin role, e.g. `bookabike-admin`. This should match the admin role name configured in Keycloak, see the application's Keycloak documentation for more details.
- `BOOKABIKE_JWT_VENDOR_ROLE_NAME`: The name of the vendor role, e.g. `bookabike-vendor`. This should match the vendor role name configured in Keycloak, see the application's Keycloak documentation for more details.
- `CORS_ALLOWED_ORIGINS`: The list of allowed origins for CORS requests, e.g. `https://your-frontend.com`. This should match the frontend URL.
- `CORS_ALLOWED_METHODS`: The list of allowed HTTP methods for CORS requests. By default it is set to `GET,POST,PUT,DELETE,OPTIONS`, which are the minimum required for the application to function correctly.
- `CORS_ALLOWED_HEADERS`: The list of allowed headers for CORS requests. By default it is set to `Content-Type,Authorization`, which are the minimum required for the application to function correctly.
