import { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

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

    // Handle input change
    const handleChange = (e, setState) => {
        setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    // Handle Signup Submission
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        console.log("Signup Data:", signupData);
        try {
            const response = await Axios.post("http://localhost:5000/api/auth/register", signupData);
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

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post("http://localhost:5000/api/auth/login", loginData);
            const data = response.data;
            // Set cookie (24h)
            document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict;`;

            // also store in localStorage
            localStorage.setItem("token", data.token);

            window.dispatchEvent(new Event('user-logged-in')); // Tell Header to recheck

            alert(data.message);
            // Navigate("/view-stock");
            Navigate("/");

        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong. Please try again.");
            }
        }
    };

    // Handle Forgot Password Steps
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const response = await Axios.post("http://localhost:5000/api/auth/forgot-password", {
            email: e.target.email.value,
            password: e.target.password.value,
        });
        setResetStep(0);
        const data = await response.data;
        alert(data.message);
    };







    return (
        <div className={styles.logincontainer}>
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
                            // value={resetData.email}
                            // onChange={(e) => handleChange(e, setResetData)}
                            className={styles.inputText}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            // value={resetData.email}
                            // onChange={(e) => handleChange(e, setResetData)}
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
