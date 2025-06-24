import React, { useState, useEffect } from 'react'
import style from './Header.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import Axios from 'axios';
import API from '../API'
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {

    const Navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);


    const logout = async () => {
        try {
            await API.post('/auth/logout', {}, { withCredentials: true });
            setIsLogin(false);
            Navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await API.get('/auth/validate-token', {
                    withCredentials: true,
                });
                if (response.data.valid) {
                    setIsLogin(true);
                } else {
                    logout();
                }
            } catch (error) {
                logout();
                console.error("Error validating token:", error);
            }
        };
        checkToken();

        // Handle login events
        const handleLogin = () => checkToken();
        window.addEventListener('user-logged-in', handleLogin);

        return () => {
            window.removeEventListener('user-logged-in', handleLogin);
        };
    }, []);





    return (
        <>

            <Toolbar className='bg-gray-100'>
                {/* Left - Title */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" color="inherit" component={NavLink} to="/" sx={{ fontWeight: 'bold' }}>
                        Diamond Portal
                    </Typography>
                </Box>

                {/* Center - Nav Links */}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {/* <Button color="inherit" component={NavLink} to="/">
                        Home
                    </Button> */}
                    {isLogin && (
                        <>
                            <Button color="inherit" component={NavLink} to="/stock-data">
                                Stock Data
                            </Button>
                            <Button color="inherit" component={NavLink} to="/share-api">
                                Share API
                            </Button>
                            <Button color="inherit" component={NavLink} to="/reports">
                                Reports
                            </Button>
                        </>
                    )}
                </Box>

                {/* Right - Auth Button */}
                <Box>
                    {!isLogin ? (
                        <Button color="inherit" component={NavLink} to="/login">
                            Login
                        </Button>
                    ) : (
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    )}
                </Box>
            </Toolbar>


            {/* <ul className={style.headerLists}>
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                {
                    !isLogin ? (
                        <li>
                            <NavLink to='/login'>Login</NavLink>
                        </li>
                    ) : (
                        <>
                            <li>
                                <NavLink to='/stock-data'>Stock Data</NavLink>
                            </li>
                            <li>
                                <NavLink to='/share-api'>Share API</NavLink>
                            </li>
                            <li>
                                <button onClick={logout}>Logout</button>
                            </li>
                        </>
                    )
                } */}
            {/* <li>
                    <NavLink to='/login'>Login</NavLink>
                </li>
                <li>
                    <NavLink onClick={logout}>Logout</NavLink>
                </li> */}
            {/* <li>
                    <NavLink to='/stock-data'>Stock Data</NavLink>
                </li> */}
            {/* <li>
                    <NavLink to='/view-stock'>View Stock</NavLink>
                </li> */}
            {/* </ul > */}
        </>
    )
}

export default Header
