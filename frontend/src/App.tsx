//import { useState } from 'react'
import './App.css';
import Banner from './components/Banner';

//import { useState } from 'react';
//import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import HomeDemo from './components/Home';

//type ValuePiece = Date | null;

//type Value = ValuePiece | [ValuePiece, ValuePiece];

function App() {
  //const [value, onChange] = useState<Value>(new Date());

  return (
    <>
      <Banner />
      <HomeDemo />
    </>
  );
}

export default App;

//<div>
//  {/*<Calendar onChange={onChange} value={value} />*/}
//</div>
