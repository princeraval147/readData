import { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import API from '../../API'
import { Alert, Snackbar } from "@mui/material";

const Login = () => {
    const [activeTab, setActiveTab] = useState("signup");
    const [resetStep, setResetStep] = useState(0); // 0 -> Normal Login, 1 -> Enter Email, 2 -> Enter OTP & New Password
    const Navigate = useNavigate();

    // Signup & Login State
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [resetData, setResetData] = useState({
        email: "",
        password: "",
    });

    // Handle input change
    // const handleChange = (e, setState) => {
    //     setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // };

    const handleChange = (e, setState) => {
        const { name, value } = e.target;
        const newValue = name === "email" ? value.toLowerCase() : value;
        setState((prev) => ({ ...prev, [name]: newValue }));
    };



    // Handle Signup Submission
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/auth/register", signupData);
            const data = response.data;
            alert("Registration successful!");
            setResetStep(0);
            setActiveTab("login");
            setSignupData({ username: "", email: "", password: "" });
            // localStorage.setItem("token", data.token);
            // document.cookie = `token=${data.token};`;
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert(error.response.data.message); // "Email already exists"
                setSignupData({ username: "", email: "", password: "" });
            } else {
                alert("Something went wrong. Please try again.");
                setSignupData({ username: "", email: "", password: "" });
                console.error("Error during signup:", error);
            }
        }
    };

    const [open, setOpen] = useState(false);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
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
            // Set cookie(24h)
            // document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict;`;

            // also store in localStorage
            // localStorage.setItem("token", data.token);

            window.dispatchEvent(new Event('user-logged-in')); // Tell Header to recheck

            alert(data.message);
            Navigate("/stock-data");
            // Navigate("/");

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setOpen(true); // This shows the snackbar
                alert(error.response.data.message);
            } else {
                setOpen(true); // This shows the snackbar
                alert("Something went wrong. Please try again.");
                console.error("Error while Login : ", error);
            }
        }
    };

    // Handle Forgot Password Steps
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const response = await API.post("/auth/forgot-password", {
            email: e.target.email.value,
            password: e.target.password.value,
        });
        setResetStep(0);
        const data = await response.data;
        alert(data.message);
    };







    return (
        <div className={styles.logincontainer}>

            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Login Failed!
                </Alert>
            </Snackbar>

            <div className={styles.formBox}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={activeTab === "signup" ? styles.active : ""}
                        onClick={() => {
                            setActiveTab("signup");
                            setResetStep(0);
                        }}
                    >
                        Signup
                    </button>
                    <button
                        className={activeTab === "login" ? styles.active : ""}
                        onClick={() => {
                            setActiveTab("login");
                            setResetStep(0);
                        }}
                    >
                        Login
                    </button>
                </div>

                {/* Signup Form */}
                {activeTab === "signup" && (
                    <form onSubmit={handleSignupSubmit} className={styles.form}>
                        <h2>Create Account</h2>
                        {/* <p>Create an account to get started.</p> */}

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={signupData.username}
                            onChange={(e) => handleChange(e, setSignupData)}
                            className={styles.inputText}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={signupData.email}
                            onChange={(e) => handleChange(e, setSignupData)}
                            className={styles.inputText}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={(e) => handleChange(e, setSignupData)}
                            className={styles.inputText}
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                )}

                {/* Forgot Password - Enter Email */}
                {resetStep === 1 && (
                    <form onSubmit={handleForgotPassword} className={styles.form}>
                        <h2>Forgot Password</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={resetData.email}
                            onChange={(e) => handleChange(e, setResetData)}
                            className={styles.inputText}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={resetData.password}
                            onChange={(e) => handleChange(e, setResetData)}
                            className={styles.inputText}
                            required
                        />
                        <button type="submit">Reset Password</button>
                    </form>
                )}

                {/* Login */}
                {activeTab === "login" && resetStep === 0 && (
                    <form onSubmit={handleLoginSubmit} className={styles.form}>
                        <h2>Login</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={(e) => handleChange(e, setLoginData)}
                            className={styles.inputText}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => handleChange(e, setLoginData)}
                            className={styles.inputText}
                            required
                        />
                        <p
                            className="link"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setActiveTab("signup");
                                setResetStep(0);
                            }}
                        >
                            Don't have Account</p>
                        <button type="submit">Login</button>
                        <button type="button" className={styles.forgotPassword} onClick={() => setResetStep(1)}>
                            Forgot Password?
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
