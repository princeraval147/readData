import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import Error from './components/Error';
import ReadExcleData from './components/ReadExcle/ReadExcleData';
import Home from './components/Home/Home';
import Login from './components/User/Login';
import ViewStock from './components/Stocks/ViewStock';
import ReadCSV from './components/ReadCSV/ReadCSV';

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='view-stock' element={<ViewStock />} />
            <Route path='read-excel' element={<ReadExcleData />} />
            <Route path='read-csv' element={<ReadCSV />} />
            <Route path='*' element={<Error />} />
        </Route>
    )
)


export default Router;
