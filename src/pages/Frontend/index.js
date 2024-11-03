import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Landing from './Landing';
import Home from './Home';
import Service from './Service';
import Menu from './Menu';
import Orders from './Orders';
import Contact from './Contact';
import Booking from './Booking';
import Profile from './Profile';
import NoPage404 from './NoPage404';
import Navbar from './../../components/Header/Navbar';
import Footer from './../../components/Footer';

export default function Frontend() {
  const location = useLocation();
  const routesWithHeader = ['/home', '/service', '/menu', '/orders', '/contact', '/booking', '/profile'];
  const routesWithFooter = ['/home', '/service', '/menu', '/orders', '/contact', '/booking'];
  const showHeader = routesWithHeader.includes(location.pathname)
  const showFooter = routesWithFooter.includes(location.pathname)

  return (
    <>
      {showHeader && <Navbar />}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/service' element={<Service />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/*' element={<NoPage404 />} />

      </Routes>
      {showFooter && <Footer/>}
    </>
  )
}
