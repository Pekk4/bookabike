package utils

type AppConfig struct {
	// Server
	Port string
	// Database
	DBHost     string
	DBPort     string
	DBSSLMode  string
	DBUser     string
	DBPassword string
	DBName     string
	// Keycloak
	KeycloakBaseURL      string
	KeycloakRealm        string
	KeycloakClientID     string
	KeycloakClientSecret string
	// RBAC
	AppRolesClaimName string
	AppAdminRoleName  string
	AppVendorRoleName string
	// CORS
	CORSAllowedOrigins string
	CORSAllowedMethods string
	CORSAllowedHeaders string
}

func LoadConfigFromEnv() *AppConfig {
	return &AppConfig{
		Port:                 getEnvOrDefault("PORT", "3000"),
		DBHost:               getEnvOrDefault("DB_HOST", "localhost"),
		DBPort:               getEnvOrDefault("DB_PORT", "5432"),
		DBSSLMode:            getEnvOrDefault("DB_SSLMODE", "disable"),
		DBUser:               getEnvOrFail("DB_USER"),
		DBPassword:           getEnvOrFail("DB_PASSWORD"),
		DBName:               getEnvOrFail("DB_NAME"),
		KeycloakBaseURL:      getEnvOrDefault("KEYCLOAK_BASE_URL", "http://localhost:8080"),
		KeycloakRealm:        getEnvOrFail("KEYCLOAK_REALM"),
		KeycloakClientID:     getEnvOrFail("KEYCLOAK_CLIENT_ID"),
		KeycloakClientSecret: getEnvOrFail("KEYCLOAK_CLIENT_SECRET"),
		AppRolesClaimName:    getEnvOrDefault("BOOKABIKE_JWT_ROLES_CLAIM_NAME", "bookabike-roles"),
		AppAdminRoleName:     getEnvOrDefault("BOOKABIKE_JWT_ADMIN_ROLE_NAME", "bookabike-admin"),
		AppVendorRoleName:    getEnvOrDefault("BOOKABIKE_JWT_VENDOR_ROLE_NAME", "bookabike-vendor"),
		CORSAllowedOrigins:   getEnvOrFail("CORS_ALLOWED_ORIGINS"),
		CORSAllowedMethods:   getEnvOrDefault("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,OPTIONS"),
		CORSAllowedHeaders:   getEnvOrDefault("CORS_ALLOWED_HEADERS", "Content-Type,Authorization"),
	}
}
