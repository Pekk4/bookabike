# Book a bike!

Bookabike on Helsingin yliopiston Fullstack Open -kurssin projektityönä MotOrg ry:lle kehitetty sovellus, jonka tarkoitus on toimia varausjärjestelmänä yhdistyksen moottoripyörälle, MotOrgBikelle. MotOrgBike on yhdistyksen oma moottoripyörä, jota yhdistyksen jäsenet voivat lainata. Sovelluksessa yhdistyksen jäsenet voivat varata moottoripyörän käyttöönsä 2-4 päivän ajaksi. Yhdistyksen hallituksen bike-vastaavat toimivat sovelluksen pääkäyttäjinä, jotka hallinnoivat varauksia.

Sovelluksen frontend on kehitetty Reactilla ja TypeScriptillä, backend taas Go:lla. Sovellus käyttää Keycloakia käyttäjien tunnistamiseen ja valtuuttamiseen, sekä PostgreSQL-tietokantaa varauksien tallentamiseen.

## Linkit

- [Sovelluksen demo](https://bookabike.staging.motorg.fi/) staging-ympäristössä
- [Työaikakirjanpito](./docs/hours.md)

## Asennus

Tarvitset Keycloakin sekä PostgreSQL-tietokannan käyttääksesi ja kehittääksesi sovellusta. Sovelluksen tietokantaskeema löytyy [täältä](./data/schema.sql) sekä ohjeet Keycloakin konfiguroimiseen sovellusta varten [täältä](./docs/keycloak.md). Lisäksi tarvitset [Node.js](https://nodejs.org/):n frontendin kehittämiseen ja [Go](https://go.dev/):n backendin kehittämiseen.

### Kehitys

Asenna tarvittavat riippuvuudet ja aseta ympäristömuuttujat (ks. [dokumentaatio](./docs/configuration.md)). Backendin kehityksessä auttaa suuresti [Air](https://github.com/air-verse/air), jolla saa live reloadit käyttöön. Airin saa asennettua `go install github.com/air-verse/air@latest` -komennolla.

```bash
# backend
cd backend/
go mod tidy
cd cmd/
mv .env.example .env

# Set the values for environment variables in .env file before reading it

export $(cat .env | xargs)
air # starts the backend server with live reloads
```
```bash
# frontend
cd frontend/
npm install
mv .env.example .env

# Set the values for environment variables in .env file before starting the dev server

npm run dev
```

### Tuotanto

Projektihakemiston juuresta löytyy `docker-compose.yml` sekä `nginx.conf` -tiedostot, joilla ympäristön saa pystyyn.

## Sovelluksen käyttö

### Tavallinen käyttäjä

Sovellukseen kirjaudutaan sisään klikkaamalla yläpalkin oikeassa reunassa olevaa kirjautumis-ikonia. Tämän jälkeen vasemmasta ikonista aukeavan valikon kautta pääsee joko tekemään uusia varauksia, tai hallinnoimaan olemassaolevia varauksia.

Hallinnoinnissa voi joko muokata, perua tai poistaa varauksia. Koska varauksia voi olla vain yksi aktiivinen varaus kerrallaan, muut tämän jälkeen tehdyt varaukset näkyvät toiveina, jotka näkyvät vain käyttäjälle itselleen. Kun muita aktiivisia varauksia ei ole, toiveen voi muuttaa aktiiviseksi varaukseksi, jolloin se siirtyy ylläpidon hyväksyttäväksi "Odottaa"-tilaan. Muokatessa jo hyväksyttyjenkin varausten ajankohtaa voi muuttaa toiseen vapaaseen ajankohtaan, varaus pysyy tällöin hyväksyttynä.

Uusia varauksia tehdessä kalenterista klikataan ensiksi aloituspäivä vapaiden päivien joukosta, jonka jälkeen valitaan lopetuspäivä. Minimivaraus on tällä hetkellä kaksi päivää ja maksimivaraus neljä päivää.

### Pääkäyttäjä

Edellä mainittujen toimintojen lisäksi pääkäyttäjälle näkyy valikossa myös `Varaustenhallinta`, josta pääsee hallinnoimaan kaikkia käyttäjien tekemiä varauksia. Pääkäyttäjä voi hyväksyä, hylätä tai perua varauksia. Hylkäämisen ja perumisen tapauksessa pääkäyttäjän täytyy antaa myös lyhyt perustelu asialle. (Tämä perustelu ei kuitenkaan toistaiseksi näy vielä missään käyttäjälle, vaan se lisätään myöhemmin.)

Hyväksymisen tarkoitus on tällä hetkellä lähinnä rajoittaa innokkaimpien varaajien varauksia, jotta mahdollisimman monet saisivat kesän aikana lainata moottoripyörää, eikä lainaukset keskittyisi lähinnä innokkaimmille varaajille. Pääkäyttäjän peruminen puolestaan on tarkoitettu lähinnä tilanteisiin, joissa pyörään on tullut esimerkiksi jokin vika.

Varaustenhallinnassa on myös kalenterinäkymä, jonka voi valita yläpalkista. Kalenterinäkymän tarkoitus on auttaa hahmottamaan varausten kokonaiskuvaa, joka voi olla taulukkonäkymässä haastavaa, mikäli varauksia on paljon. Kalenterinäkymässä varauksia voi klikata, jolloin niiden tiedot aukeavat tarkasteltavaksi varauskohtaisesti ja em. toimenpiteet ovat suoritettavissa myös tämän näkymän kautta.


## Sovelluksen tila ja puutteet

Sovelluksen kanssa kävi klassinen arviointivirhe ja tuli haukattua aivan liian iso pala kurssiprojektiksi. Projektiin on palanut jo yli 200h ja oma arvioni on, että sen todelliseen tuotantokuntoon (oikeaan käyttöön) saaminen vaatinee luultavasti vielä lähemmäs toiset 200h työtä. Näin ollen sovelluksessa on vielä paljon erilaisia puutteita ja vikoja, tässä niistä muutamia:

- Minimivaraus on tällä hetkellä kaksi päivää, sillä kalenteri ei vielä osaa yhden päivän varauksia (nämä ovat toisaalta myös erittäin harvinaisia, tiedän pyörän historian ajalta tasan yhden tapauksen)
- Kaikenlainen automaatio puuttuu, esimerkiksi automaatttisähköpostit varausten tilan muuttumisesta tai automaattinen hyväksyntä esimerkiksi ensimmäistä varaustaan tekeville (myös tarvittavan datan keruu tällaiseen puuttuu vielä)
- Etusivun uutisten kaikki toiminnallisuus päästä päähän puuttuu vielä täysin
- Jo menneet varaukset jäävät kummittelemaan järjestelmään, samoin perutut ja hylätyt, mikäli käyttäjät eivät itse niitä poista. Tämä johtuu lähinnä siitä, että käyttäjien on mahdollista nähdä, mikäli varauksen tila on muuttunut joksikin edellä mainituista ja mahdollinen syy sille, mutta myös tuo syyn näkyminen puuttuu vielä (oh the irony)
- Sovelluksessa on tarkoitus olla oma käyttäjäryhmänsä myös pyörän haltijoille, jotka luovuttavat pyörän varaajalle ja vastaanottavat sen takaisin, mutta tätä ei ole vielä toteutettu ja toistaiseksi he toimivat pääkäyttäjinä myös
- Noutopaikaksi on kovakoodattu Vantaa, pyörä noudetaan kyllä 90% kerroista sieltä, mutta tällä kaudella pyörä oli hetken noudettavissa myös Tampereelta
- Varauksia voi tehdä mihin vaan, kalenterin vapaita päiviä ei ole rajoitettu mitenkään
- Bäkkärillä olisi hyvä olla jonkinlainen /healtcheck endpoint, mutta johtuen backendin arkkitehtuurista tätä ei ole vielä toteutettu
- Yleisesti kummankin pään virheenkäsittely ja käyttäjän informoiminen asiasta on suorastaan perseestä
- Responsiivinen leiska puuttuu, jotta sovellus olisi mukava käyttää myös mobiililaitteilla
- Testit ja muut vastaavat hyvät käytännöt puuttuvat vielä lähes täysin

Sovelluksen kehitys kuitenkin jatkuu opintojen ohessa iltapuhteina, sillä sen tarve ja käyttötapaukset ovat ihan todelliset ja myöskin polte saada tämä oikeasti käyttöön on kova.

## Lähteet

- Yhdistyksen grafiikat (logo, favicon) © MotOrg ry
- Taustakuva by ChatGPT
- Keycloakin frontend-implementaation (keycloak-js kirjaston) kanssa alkuun auttoi [Ariel Parra](https://darkaico.medium.com/building-a-secure-authentication-system-with-keycloak-react-and-flask-35aeee04e37a)
