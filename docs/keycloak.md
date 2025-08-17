# Keycloak

This application relies on Keycloak for authentication and authorization. [Keycloak](https://www.keycloak.org/) is an open-source Identity and Access Management solution that provides e.g. single sign-on (SSO) capabilities, user federation, identity brokering, and so on.

## Keycloak Configuration (in production version)

The required configuration for Keycloak is to set up a clients for the frontend and backend, create and assign the required application roles and add them into a claim in the access token.

### Clients

#### Frontend Client

For the frontend client we use OIDC (OpenID Connect) as a client type. Client ID should be something like `bookabike-frontend`, so it is easy to identify among other clients. For the authentication flow we use just the standard flow, and keep the confidential mode off, as the frontend is a public client. Finally we set the valid URLs and URIs. As the frontend is a single page application, we set the valid redirect URIs to have the wildcard: `https://example.com/*` and the rest of the URLs without it, especially the web origins.

The frontend configuration uses that Client ID given as an environment variable.

##### Frontend Client roles

When the client is created, we need to add the required roles. The frontend client requires the following roles:

- `admin`: Admin role is for the application administrators, who are responsible for managing the bike, thus confirming/rejecting/revoking the bike reservations.

- `vendor`: Vendor role is for the bike vendors, who are responsible for verifying the booker's information and handing over and receiving the bike from the bookers.

#### Backend Client

For the backend client we use OIDC as well, with a client ID something like `bookabike-backend`. With backend client the confidential mode should be on and then from the authentication flow the `Service account roles` should be enabled. This allows the backend to authenticate itself and access the Keycloak API to fetch the user information. The URLs should be set to the application's URLs.

The backend configuration uses that Client ID and Client Secret given as an environment variables.

##### Backend Client roles

With backend client it is sufficient to just assign the realm-management role `view-users` to the service account. This allows the backend to access the user information via Keycloak API. This can be done in the Keycloak admin console under the `Service Account Roles` tab of the backend client.

### Claims

To ensure that the roles are included in the access token, we need to add a mapper to the client scopes. This mapper should map the application roles to a claim in the access token. 

In `Client Scopes` section, search for the `roles` client scope and add a new mapper (by configuration). Use type `User Realm Role` and set the name to something like `bookabike-roles`. This name is used in the application configuration. Set the Client ID to frontend client ID, so the roles are included in the access token for the frontend client.
Use Client Role prefix, e.g. `bookabike-`, so the roles are prefixed in the access token and then set the Token Claim Name to like `bookabike-roles`. This claim name is used in the application configuration. Finally, enable the `Add to ID token` and `Add to access token` options.

The application seeks the roles in the access token under the claim configured here.

### Users

Finally, the application roles should be assigned to the users. Regular users don't need any special roles, but the admin and vendor roles should be assigned to the respective users. This can be done in the Keycloak admin console under the `Users` section, by selecting a user and then assigning the roles in the `Role Mappings` tab.

## Keycloak Configuration (in development version)

In the local development version those URLs and URIs can be set just to wildcards `*`.
