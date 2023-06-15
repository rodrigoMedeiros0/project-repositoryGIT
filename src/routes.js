import React from 'react';
import {BrowserRouter,  Route, Routes} from 'react-router-dom';

import Main from './pages/Main';
import Repositorio from './pages/Repositorio';

export default function FileRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<Main />}/>
                <Route exact path='/repositorio/' element={<Repositorio />}/>
                <Route exact path='/repositorio/:repositorio' element={<Repositorio />}/>
            </Routes>
        </BrowserRouter>
    );
}