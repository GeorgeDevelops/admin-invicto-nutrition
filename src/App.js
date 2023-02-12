import React, { useState, useEffect } from 'react';
import NavBar from './components/navbar';
import { Outlet } from 'react-router-dom';
import moment from 'moment/moment';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [time, setTime] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));

  setInterval(() => {
    setTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }, 1000);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token || token === "") window.location = "/login";

  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <NavBar />
      <div id="timeBanner">{time}</div>
      <Outlet />
    </div>
  );
}

export default App;
