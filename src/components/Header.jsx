import React, { useState, useEffect } from 'react'
import style from './Header.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import Axios from 'axios';

const Header = () => {

    const Navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);


    // const logout = () => {
    //     document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    //     // localStorage.removeItem("token");
    //     setIsLogin(false);
    //     Navigate("/login");
    // }

    const logout = async () => {
        try {
            await Axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
            setIsLogin(false);
            Navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    // Utility to read cookie by name
    // function getCookie(name) {
    //     const cookieString = document.cookie; // all cookies in one string
    //     const cookies = cookieString.split('; '); // split into array by "; "
    //     for (let cookie of cookies) {
    //         const [cookieName, cookieValue] = cookie.split('=');
    //         if (cookieName === name) {
    //             return decodeURIComponent(cookieValue);
    //         }
    //     }
    //     return null; // cookie not found
    // }

    // useEffect(() => {
    //     const checkToken = async () => {
    //         // const token = getCookie('token');
    //         // if (!token) {
    //         //     setIsLogin(false);
    //         //     return;
    //         // }
    //         // console.log("Token found From header compo : ", token);
    //         try {
    //             const response = await Axios.get('http://localhost:5000/api/auth/validate-token', {
    //                 // withCredentials: true, // ✅ Sends the cookie to the backend
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //                 // withCredentials: true, // ✅ Sends cookies
    //             });
    //             if (response.data.valid) {
    //                 setIsLogin(true);
    //             } else {
    //                 logout();
    //             }
    //         } catch (error) {
    //             logout();
    //             console.error("Error validating token : ", error);
    //         }
    //     };
    //     checkToken();

    //     // Listen to login event from other components
    //     const handleLogin = () => checkToken();
    //     window.addEventListener('user-logged-in', handleLogin);

    //     return () => {
    //         window.removeEventListener('user-logged-in', handleLogin);
    //     };
    // }, []);

    useEffect(() => {
        const checkToken = async () => {
            // const token = localStorage.getItem('token'); // or wherever you're storing it
            // if (!token) {
            // setIsLogin(false);
            // return;
            // }
            // console.log("Token found in localStorage:", token);
            try {
                const response = await Axios.get('http://localhost:5000/api/auth/validate-token', {
                    withCredentials: true,
                    // headers: {
                    // Authorization: `Bearer ${token}`,
                    // }
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
