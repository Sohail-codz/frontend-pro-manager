import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from '../Register/Register.module.css'
import homeImage from '../../assets/home_art.png'
import userIcon from '../../assets/user.png'
import emailIcon from '../../assets/email.png'
import passIcon from '../../assets/lock.png'
import visibilityIcon from '../../assets/visibility.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
    const MAIN_URL = process.env.REACT_APP_API_URL;

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading,setLoading] = useState(false);

    const [errors, setErrors] = useState({})

    const [visiblePassword, setVisiblePassword] = useState(false)
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false)

    const navigate = useNavigate();

    const validateForm = () =>{
        const newErrors = {};

        if(!name.trim()){
            newErrors.name = 'Name is required'
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }
        if(!password.trim()){
            newErrors.password = 'Password is required';
        }
        if(password !== confirmPassword){
            newErrors.confirmPassword = 'Passwords do not match'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(validateForm()){
            try{
                const response = await axios.post(`${MAIN_URL}/register`,{
                    name,
                    email,
                    password
                })
                toast.success('Registration Successful!', { position:'top-right', autoClose: 2000 });
                setTimeout(() => {
                    navigate('/');
                  }, 3000);
                console.log(response.data);
            } catch(error){
                console.log('registration failed', error.response.data);
                if(error.response.data.error){
                    const errorMessage = error.response.data.error.toLowerCase();
                    if(errorMessage.includes('exists')){
                        setErrors({ email: error.response.data.error });
                        return;
                    }
                }
            } finally {
                setLoading(false); 
            }
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } else{
            console.log('Form validation error');
            setLoading(false);
        }
    };

    const loginRedirect = () =>{
        navigate('/');
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
            <h1 className={styles.registerHeading}>Register</h1>
            <form>
                <div className={styles.nameArea}>
                    <img src={userIcon} alt='userico'></img>
                    <input
                    type='text'
                    value={name}
                    name='name'
                    placeholder='Name'
                    onChange={(e) => setName(e.target.value)}></input>
                </div>
                {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
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
                    type={visiblePassword ? 'text' : 'password' }
                    value={password}
                    name='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}></input>
                    <img src={visibilityIcon} alt='eyeico' style={{marginRight:'10px', cursor:'pointer'}} onClick={() => setVisiblePassword(!visiblePassword)}></img>
                </div>
                {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
                <div className={styles.confirmPasswordArea}>
                    <img src={passIcon} alt='passIco'></img>
                    <input 
                    type={visibleConfirmPassword ? 'text' : 'password' }
                    value={confirmPassword}
                    name='confirmPassword'
                    placeholder='Password'
                    onChange={(e) => setConfirmPassword(e.target.value)}></input>
                    <img src={visibilityIcon} alt='eyeico' style={{marginRight:'10px', cursor:'pointer'}} onClick={() => setVisibleConfirmPassword(!visibleConfirmPassword)}></img>
                </div>
                {errors.confirmPassword && (
                    <p className={styles.errorMsg}>{errors.confirmPassword}</p>
                  )}
            </form>
            <div className={styles.registerButton}>
                <button onClick={handleRegister}>
                {loading ? "Loading..." : "Register"}
                </button>
            </div>
            <p style={{color:'#828282'}}>Have an account ?</p>
            <div className={styles.logRedirect}>
                <button onClick={loginRedirect}>Login</button>
            </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default Register
