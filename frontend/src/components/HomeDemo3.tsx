const mockNews = [
  {
    id: 1,
    title: 'Kesäkausi alkaa!',
    preview:
      'MotOrgBike on nyt varattavissa kesäkaudelle. Muista tarkistaa kalenteri ja varaa ajoissa...',
  },
  {
    id: 2,
    title: 'Huoltotauko heinäkuussa',
    preview: 'Pyörä huolletaan 10.-15.7. eikä ole silloin varattavissa. Pahoittelemme häiriötä.',
  },
  {
    id: 3,
    title: 'Uusi varausjärjestelmä julkaistu',
    preview:
      'Olemme päivittäneet varausjärjestelmän. Käyttöliittymä on nyt entistä selkeämpi ja nopeampi.',
  },
  {
    id: 4,
    title: 'Ajoturvallisuuskurssi elokuussa',
    preview:
      'Ilmoittaudu mukaan ajoturvallisuuskurssille 22.8.! Kurssi on maksuton kaikille jäsenille.',
  },
  {
    id: 5,
    title: 'Pyörän pesutalkoot',
    preview:
      'Järjestämme pyörän pesutalkoot 5.6. klo 18. Tervetuloa mukaan huoltamaan yhteistä menopeliä!',
  },
  {
    id: 6,
    title: 'Varausmaksu muuttuu',
    preview: 'Varausmaksu on jatkossa 10€/päivä. Muutos astuu voimaan 1.9.2025.',
  },
  {
    id: 7,
    title: 'Syyskauden päätösajelu',
    preview: 'Syyskauden päätösajelu järjestetään 28.9. Kaikki jäsenet ovat tervetulleita mukaan!',
  },
  {
    id: 8,
    title: 'Vakuutusturva laajenee',
    preview: 'MotOrgBiken vakuutusturva kattaa nyt myös rengasrikot ja hinauspalvelun.',
  },
  {
    id: 9,
    title: 'Jäsenkysely tulossa',
    preview: 'Haluamme kuulla mielipiteesi pyörän käytöstä. Vastaa jäsenkyselyyn ensi viikolla!',
  },
  {
    id: 10,
    title: 'Talvisäilytys alkaa',
    preview:
      'Pyörä siirretään talvisäilytykseen 15.10. asti. Kiitos kaikille käyttäjille kuluneesta kaudesta!',
  },
  {
    id: 11,
    title: 'Kesäretki Ahvenanmaalle',
    preview:
      'Suunnittelemme yhteistä kesäretkeä Ahvenanmaalle heinäkuussa. Ilmoittaudu mukaan ajoissa!',
  },
  {
    id: 12,
    title: 'Uudet ajovarusteet saatavilla',
    preview: 'Yhdistykselle on hankittu uusia ajovarusteita. Kysy lisää varustevastaavalta!',
  },
  {
    id: 13,
    title: 'Jäsenmaksu 2025',
    preview: 'Muistathan maksaa jäsenmaksun ensi kaudelle. Maksuohjeet löytyvät sähköpostista.',
  },
  {
    id: 14,
    title: 'Pyörän renkaat vaihdettu',
    preview: 'MotOrgBiken renkaat on vaihdettu uusiin. Turvallisia ajoja kaikille!',
  },
  {
    id: 15,
    title: 'Syyskokous lokakuussa',
    preview: 'Yhdistyksen syyskokous järjestetään 10.10. Tervetuloa vaikuttamaan!',
  },
  {
    id: 16,
    title: 'Ajokilpailu tulossa',
    preview: 'Järjestämme leikkimielisen ajokilpailun elokuussa. Kaikki jäsenet tervetulleita!',
  },
  {
    id: 17,
    title: 'Pyörän huoltopäivä',
    preview: 'Seuraava huoltopäivä on 20.8. Tule mukaan oppimaan pyörän huollosta!',
  },
  {
    id: 18,
    title: 'Uusi yhteistyökumppani',
    preview:
      'Olemme solmineet yhteistyön paikallisen huoltoliikkeen kanssa. Jäsenet saavat alennuksia!',
  },
  {
    id: 19,
    title: 'Talvikauden varastointi',
    preview: 'Pyörä varastoidaan talvikaudeksi lämpimään tilaan. Kiitos kaikille käyttäjille!',
  },
  {
    id: 20,
    title: 'Joulutervehdys jäsenille',
    preview:
      'MotOrgBike-tiimi toivottaa kaikille jäsenille rauhallista joulua ja hyvää uutta vuotta!',
  },
];

const HomeDemo = () => {
  return (
    <div className="flex flex-row h-full">
      <div className="m-20">
        <div className="h-full overflow-auto p-6 bg-white rounded-md">
          <h2 className="mb-4 text-xl font-bold">Uutiset</h2>
          <ul className="space-y-3">
            {mockNews.map((news) => (
              <li key={news.id} className="border-b pb-2 last:border-b-0 text-left">
                <div className="font-semibold">{news.title}</div>
                <div className="text-sm text-gray-700">{news.preview}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="m-20">
        <p className="p-10 bg-white rounded-md">
          MotOrgBike on yhdistyksemme oma moottoripyörä, joka on tarkoitettu jäsenten lainattavaksi
          1-4 päiväksi kerrallaan. Pyörä on Yamaha MT-07, vuosimallia 2017, ja sen teho on 55 kW,
          joten kuljettamiseen vaadittava ajokorttiluokka on A. Lainaaminen edellyttää
          voimassaolevaa yhdistyksen jäsenyyttä. Siirry{' '}
          <a className="font-bold text-blue-500" href="/calendar">
            kalenteriin
          </a>{' '}
          ja varaa pyörä itsellesi!
        </p>
      </div>
    </div>
  );
};

export default HomeDemo;
