package authi

import "github.com/Nerzal/gocloak/v7"

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
		clientSecret: "lkRAIttbs4YmkmNTbTM3LnX1FivGtpgz",
		realm:        "testi",
	}
}
