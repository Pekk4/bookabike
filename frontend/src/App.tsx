import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
//import { useState } from 'react'
import './App.css';
import MenuBar from './components/MenuBar';

//import { useState } from 'react';
//import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import HomeDemo from './components/Home';

import { KeycloakProvider } from './context/KeycloakContext';
import ErrorBoundary from './context/ErrorBoundary';
import AppRoutes from './AppRoutes';

import { apiBaseUrl } from './constants';

//type ValuePiece = Date | null;

//type Value = ValuePiece | [ValuePiece, ValuePiece];

function App() {
  //const [value, onChange] = useState<Value>(new Date());

  //useEffect(() => {
  //  void axios.get<void>(`http://localhost:3000/api/ping`); // TO BE DELETED...
  //}, []);

  return (
    <>
      <KeycloakProvider>
        <ErrorBoundary>
          <Router>
            <AppRoutes />
            {/* Modal wont cover menubar with router anymore // TODO: check out*/}
            <MenuBar />
            {/*<HomeDemo />*/}
          </Router>
        </ErrorBoundary>
      </KeycloakProvider>
    </>
  );
}

export default App;

//<div>
//  {/*<Calendar onChange={onChange} value={value} />*/}
//</div>
