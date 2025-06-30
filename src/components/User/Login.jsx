import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from '../../API'
import { FaGem } from "react-icons/fa";

const Login = () => {

    const Navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e, setState) => {
        const { name, value } = e.target;
        const newValue = name === "email" ? value.toLowerCase() : value;
        setState((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/auth/login",
                loginData,
                {
                    withCredentials: true, // ✅ Let backend set HttpOnly cookie
                }
            );
            const data = response.data;
            // store in local for check Admin
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('user-logged-in')); // Tell Header to recheck

            alert(data.message);
            Navigate("/stock-data");

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong. Please try again.");
                console.error("Error while Login : ", error);
            }
        }
    };






    return (
        <>
            <div className="h-130 bg-gray-100 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                    <div className="flex justify-center mb-4">
                        <FaGem className="text-indigo-500 text-3xl" />
                    </div>
                    <h2 className="text-xl text-center font-semibold text-gray-700 mb-6">
                        Login to Platinum Diam
                    </h2>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={loginData.email}
                            onChange={(e) => handleChange(e, setLoginData)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => handleChange(e, setLoginData)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                            required
                        />
                        {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
                        <p className="text-sm text-center text-gray-500">
                            <NavLink to="/forget-password" className="text-indigo-600 font-medium hover:underline">
                                Forgot Password
                            </NavLink>
                        </p>

                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md transition"
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-sm text-center mt-6 text-gray-500">
                        Don’t have an account?{' '}
                        <NavLink to="/register" className="text-indigo-600 font-medium hover:underline">
                            Register
                        </NavLink>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
