import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../Login/Login.module.css'
import homeImage from '../../assets/home_art.png'
import emailIcon from '../../assets/email.png'
import passIcon from '../../assets/lock.png'
import visibilityIcon from '../../assets/visibility.png'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)
    const [errors, setErrors] = useState({})
    
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

    const handleLogin = (e) => {
        e.preventDefault()

        if (validateForm()) {
            console.log('Form validated successfully!');
            console.log('Email:', email);
            console.log('Password:', password);
            setEmail('');
            setPassword('');
        } else {
            console.log('Form validation failed.');
        }
    }

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
                    <button type='submit' form='loginForm'>Login</button>
                </div>
                <p style={{ color: '#828282' }}>Have no account yet ?</p>
                <div className={styles.regRedirect}>
                    <button onClick={registerRedirect}>Register</button>
                </div>
            </div>
        </div>
    )
}

export default Login;
