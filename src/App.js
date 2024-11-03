import React from 'react';
import './App.scss';
import 'bootstrap/dist/js/bootstrap.bundle';
import Routes from './pages/Routes';
import ScreenLoader from './components/ScreenLoader';
import { useAuthContext } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const {isAppLoading} = useAuthContext();
  return (
    <>
    <ScrollToTop />
    {!isAppLoading ?  <Routes /> :  <ScreenLoader /> }
   </>
  );
}

export default App;
