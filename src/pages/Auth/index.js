import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import NoPage404 from '../Frontend/NoPage404';

export default function Auth() {
    return (
        <Routes>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='*' element={<NoPage404 />} />
        </Routes>
    )
}
