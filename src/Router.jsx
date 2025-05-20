import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import Error from './components/Error';
import ReadExcleData from './components/ReadExcle/ReadExcleData';
import ReadCSV from './components/ReadCSV';
import Home from './components/Home/Home';

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='read-excel' element={<ReadExcleData />} />
            <Route path='read-csv' element={<ReadCSV />} />
            <Route path='*' element={<Error />} />
        </Route>
    )
)


export default Router;
