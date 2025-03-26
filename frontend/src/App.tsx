//import { useState } from 'react'
//import './App.css'


//import { useState } from 'react';
//import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
//import BookingCalendar from "./components/BookinCalendar";
import BookingCalendar from "./components/TestCalendar";
//import BookingCalendar from "./components/AnotherCalendar";

//type ValuePiece = Date | null;

//type Value = ValuePiece | [ValuePiece, ValuePiece];


function App() {
  //const [value, onChange] = useState<Value>(new Date());

  return (
    <>
      <div>
        {/*<Calendar onChange={onChange} value={value} />*/}
        <BookingCalendar />
      </div>
    </>
  )
}

export default App
