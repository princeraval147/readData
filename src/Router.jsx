import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import Error from './components/Error';
import Home from './components/Home/Home';
import Login from './components/User/Login';
import StockData from './components/Stock Data/StockData';
import ShareAPI from './components/ShareAPI/ShareAPI';
import ProtectedRoute from './ProtectedRoute';

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='*' element={<Error />} />
            <Route element={<ProtectedRoute />}>
                <Route path='stock-data' element={<StockData />} />
                <Route path='share-api' element={<ShareAPI />} />
            </Route>
        </Route>
    )
)


export default Router;
