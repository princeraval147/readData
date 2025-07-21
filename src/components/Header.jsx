import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import API from '../API';

const Header = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.isAdmin === true || user?.isAdmin === 1;

    const logout = async () => {
        try {
            await API.post('/auth/logout', {}, { withCredentials: true });
            setIsLogin(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
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
            }
        };
        checkToken();

        window.addEventListener('user-logged-in', checkToken);
        return () => window.removeEventListener('user-logged-in', checkToken);
    }, []);

    const navLinks = [
        { label: 'Stock Data', to: '/stock-data' },
        { label: 'Share API', to: '/share-api' },
        { label: 'Reports', to: '/reports' },
        ...(isAdmin ? [{ label: 'Dashboard', to: '/admin/dashboard' }] : []),
        ...(isAdmin ? [{ label: 'Diamonds', to: '/diamonds' }] : []),
    ];

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <header className="bg-white border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Title */}
                    <NavLink to="/" className="text-xl font-bold text-gray-800">
                        Diamond Diam
                    </NavLink>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-6">
                        {isLogin &&
                            navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `text-gray-700 hover:text-black transition ${isActive ? 'font-semibold underline' : ''
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                    </nav>




                        <NavLink
                            to="/view-stock"
                            className={({ isActive }) =>
                                `text-gray-700 hover:text-black transition ${isActive ? 'font-semibold underline' : ''}`
                            }
                        >
                            View Stock
                        </NavLink>





                    {/* Desktop Auth Button */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isLogin ? (
                            <NavLink to="/login" className="text-gray-700 hover:text-black">
                                Login
                            </NavLink>
                        ) : (
                            <button
                                onClick={logout}
                                className="text-gray-700 hover:text-black cursor-pointer"
                            >
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={
                                        menuOpen
                                            ? 'M6 18L18 6M6 6l12 12'
                                            : 'M4 6h16M4 12h16M4 18h16'
                                    }
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <nav className="flex flex-col px-4 py-2 space-y-1">
                        {isLogin &&
                            navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `py-2 px-2 text-gray-700 hover:text-black ${isActive ? 'font-semibold underline' : ''
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}

                        {!isLogin ? (
                            <NavLink
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="py-2 px-2 text-gray-700 hover:text-black"
                            >
                                Login
                            </NavLink>
                        ) : (
                            <button
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                                className="py-2 px-2 text-left text-gray-700 hover:text-black"
                            >
                                Logout
                            </button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
