import React, { useState, useEffect } from 'react'
import style from './Header.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import Axios from 'axios';

const Header = () => {

    const Navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);

    // Utility to read cookie by name
    function getCookie(name) {
        const cookieString = document.cookie; // all cookies in one string
        const cookies = cookieString.split('; '); // split into array by "; "
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null; // cookie not found
    }

    const logout = () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        localStorage.removeItem("token");
        setIsLogin(false);
        Navigate("/login");
    }

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token') || getCookie('token');
            if (!token) {
                setIsLogin(false);
                return;
            }

            try {
                const response = await Axios.get('http://localhost:5000/api/auth/validate-token', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.valid) {
                    setIsLogin(true);
                } else {
                    logout();
                }
            } catch (error) {
                logout();
                console.error("Error validating token : ", error);
            }
        };

        // Initial check
        checkToken();

        // Listen to login event from other components
        const handleLogin = () => checkToken();
        window.addEventListener('user-logged-in', handleLogin);

        return () => {
            window.removeEventListener('user-logged-in', handleLogin);
        };
    }, []);





    return (
        <>
            <ul className={style.headerLists}>
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
                                <button onClick={logout}>Logout</button>
                            </li>
                            <li>
                                <NavLink to='/stock-data'>Stock Data</NavLink>
                            </li>
                        </>
                    )
                }
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
            </ul>
        </>
    )
}

export default Header
