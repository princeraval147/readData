import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import API from '../../API';

const ForgetPassword = () => {

    const Navigate = useNavigate();
    const [resetData, setResetData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e, setState) => {
        const { name, value } = e.target;
        const newValue = name === "email" ? value.toLowerCase() : value;
        setState((prev) => ({ ...prev, [name]: newValue }));
    };


    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/auth/forgot-password", {
                email: e.target.email.value,
                password: e.target.password.value,
            });
            const data = await response.data;
            alert(data.message);
            Navigate('/login');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong. Please try again.");
                console.error("Error while Reset Password : ", error);
            }
        }
    };


    return (
        <>
            <div className="h-130 bg-gray-100 flex items-center justify-center px-4">
                <form onSubmit={handleForgotPassword} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
                    <h2 className="text-xl font-semibold text-center text-gray-700">Reset Password</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={resetData.email}
                        onChange={(e) => handleChange(e, setResetData)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={resetData.password}
                        onChange={(e) => handleChange(e, setResetData)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md transition"
                    >
                        Submit
                    </button>

                    <p className="text-sm text-center text-gray-500">
                        Back to{' '}
                        <NavLink
                            to="/login"
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            Login
                        </NavLink>
                    </p>
                </form>
            </div>
        </>
    )
}

export default ForgetPassword
