import { mockNews } from '@utils/mockNews';

const FrontPage = () => {
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

export default FrontPage;
