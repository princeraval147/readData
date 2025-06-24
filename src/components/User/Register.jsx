import { useState } from 'react';
import { FaGem } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import API from '../../API';

export default function Register() {
    const [form, setForm] = useState({
        username: '',
        company: '',
        email: '',
        contact: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const Navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await API.post('/auth/register', form);
            alert('Registration successful!');
            Navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setError(msg);
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <div className="flex justify-center mb-4">
                    <FaGem className="text-indigo-500 text-3xl" />
                </div>
                <h2 className="text-xl text-center font-semibold text-gray-700 mb-6">
                    Create Your Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Full Name"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                    <input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                    <input
                        type="tel"
                        name="contact"
                        placeholder="Contact Number"
                        value={form.contact}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md transition"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-center mt-6 text-gray-500">
                    Already have an account?{' '}
                    <NavLink to="/login" className="text-indigo-600 font-medium hover:underline">
                        Login
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
