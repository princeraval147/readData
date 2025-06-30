import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import Error from './components/Error';
import Home from './components/Home/Home';
import Login from './components/User/Login';
import StockData from './components/Stock Data/StockData';
import ShareAPI from './components/ShareAPI/ShareAPI';
import Reports from './components/Reports/Reports';
import ProtectedRoute from './ProtectedRoute';
import Register from './components/User/Register';
import ForgetPassword from './components/User/ForgetPassword';
import Dashboard from './components/Admin/Dashboard';
import ProtectedAdminRoute from './ProtectedAdminRoute';
import AdminPanel from './components/Admin/AdminPanel';
import Users from './components/Admin/Users';
import AllStocks from './components/Admin/AllStocks';

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='Register' element={<Register />} />
            <Route path='forget-password' element={<ForgetPassword />} />
            <Route path='*' element={<Error />} />
            <Route element={<ProtectedRoute />}>
                <Route path='stock-data' element={<StockData />} />
                <Route path='reports' element={<Reports />} />
                <Route path='share-api' element={<ShareAPI />} />
            </Route>
            <Route element={<ProtectedAdminRoute />}>
                <Route element={<AdminPanel />}>
                    <Route path='admin/dashboard' element={<Dashboard />} />
                    <Route path='admin/users' element={<Users />} />
                    <Route path='admin/all-stocks' element={<AllStocks />} />
                </Route>
            </Route>
        </Route>
    )
)


export default Router;
