package authi

import "github.com/Nerzal/gocloak"

type keycloak struct {
	gocloak      gocloak.GoCloak // keycloak client
	clientId     string          // clientId specified in Keycloak
	clientSecret string          // client secret specified in Keycloak
	realm        string          // realm specified in Keycloak
}

func NewKeycloak() *keycloak {
	return &keycloak{
		gocloak:      gocloak.NewClient("http://localhost:8080"),
		clientId:     "testi-backend",
		clientSecret: "d4LC4BvGGPbQYRtxId8h3o6LO8REpCEQ",
		realm:        "testi",
	}
}
