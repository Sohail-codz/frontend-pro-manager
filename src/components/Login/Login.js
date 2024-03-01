import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../Login/Login.module.css'
import homeImage from '../../assets/home_art.png'
import emailIcon from '../../assets/email.png'
import passIcon from '../../assets/lock.png'
import visibilityIcon from '../../assets/visibility.png'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const MAIN_URL = process.env.REACT_APP_API_URL

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading,setLoading] = useState(false);
    
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (validateForm()) {
            try {
                const response = await axios.post(`${MAIN_URL}/login`, {
                    email,
                    password,
                });
                localStorage.setItem("name", response.data.User_Name);
                localStorage.setItem("token", response.data.token);
                toast.success('Login Successful!', { position:'top-right', autoClose: 2000 });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } catch (error) {
                console.log('Login failed:', error.response.data);
                if (error.response.data.error) {
                    const errorMessage = error.response.data.error.toLowerCase();
                    if (errorMessage.includes('not')) {
                        setErrors({ email: error.response.data.error });
                        return;
                    }
                    if (errorMessage.includes('invalid')) {
                        setErrors({ password: error.response.data.error });
                        return;
                    }
                }
            } finally {
                setLoading(false);
            }
            setEmail('');
            setPassword('');
        } else {
            console.log('Form validation failed.');
            setLoading(false);
        }
    };

    const registerRedirect = () => {
        navigate('/register');
    }

    return (
        <div className={styles.container}>
            <div className={styles.leftPart}>
                <div className={styles.imageArea}>
                    <div className={styles.circle}></div>
                    <img src={homeImage} alt='HomeImage'></img>
                </div>
                <h1 className={styles.heading}>Welcome aboard my friend</h1>
                <p className={styles.tagline}>just a couple of clicks and we start</p>
            </div>
            <div className={styles.rightPart}>
                <h1 className={styles.loginHeading}>Login</h1>
                <form id='loginForm' onSubmit={handleLogin}>
                    <div className={styles.emailArea}>
                        <img src={emailIcon} alt='emailico'></img>
                        <input
                            type='email'
                            value={email}
                            name='email'
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
                    <div className={styles.passwordArea}>
                        <img src={passIcon} alt='passIco'></img>
                        <input
                            type={visible ? 'text' : 'password'}
                            value={password}
                            name='password'
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}></input>
                        <img src={visibilityIcon} alt='eyeico' style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => setVisible(!visible)}></img>
                    </div>
                    {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
                </form>
                <div className={styles.loginButton}>
                    <button type='submit' form='loginForm'>
                    {loading ? "Loading..." : "Login"}
                    </button>
                </div>
                <p style={{ color: '#828282' }}>Have no account yet ?</p>
                <div className={styles.regRedirect}>
                    <button onClick={registerRedirect}>Register</button>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default Login;
