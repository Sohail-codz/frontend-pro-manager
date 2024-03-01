import React,{useState} from 'react'
import styles from '../DashboardSidebar/DashboardSidebar.module.css'
import mainLogo from '../../assets/mainLogo.png'
import analyticsicon from '../../assets/analytics.png'
import boardicon from '../../assets/board.png'
import settingsicon from '../../assets/settings.png' 
import logouticon from '../../assets/logout.png'
import { useNavigate } from 'react-router-dom'

function DashboardSidebar({onOptionChange}) {
    const navigate = useNavigate();
    const [ logoutPopUp,setLogoutPopUp] = useState(false)

    const authToken = localStorage.getItem('token');

    const handleOptionChange = (option)=>{
        onOptionChange(option);
    }

    const handleLogout = () =>{
        setLogoutPopUp(true);
    }

    const handleConfirmLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleClosePopUp = () =>{
        setLogoutPopUp(false);
    }

  return (
    <div className={styles.container}>
        <div className={styles.options}>
            <div className={styles.header}>
                <img src={mainLogo} alt='icon'></img>
                <h2>Pro Manager</h2>
            </div>
            <div className={styles.boardArea} onClick={()=> handleOptionChange('Board')}>
                <img src={boardicon} alt='icon' style={{opacity:'50%'}}></img>
                <h2>Board</h2>
            </div>
            <div className={styles.analyticsArea} onClick={()=> handleOptionChange('Analytics')}>
                <img src={analyticsicon} alt='icon' style={{opacity:'50%'}}></img>
                <h2>Analytics</h2>
            </div>
            <div className={styles.settingsArea} onClick={()=> handleOptionChange('Settings')}>
                <img src={settingsicon} alt='icon' style={{opacity:'50%'}}></img>
                <h2>Settings</h2>
            </div>
        </div>
        <div className={styles.logoutArea}>
            <img src={logouticon} alt='icon'></img>
            <h2 style={{color:'red'}} onClick = {authToken ? handleLogout : () => navigate('/')}>
            {authToken ? 'Log out' : 'Log In'}
            </h2>
        </div>
        {logoutPopUp && (
            <Popup
              onConfirm={handleConfirmLogout}
              onCancel={handleClosePopUp}
            />
          )}
    </div>
  )
}

function Popup({ onConfirm, onCancel }) {
    return (
      <div className={styles.popupContainer}>
        <div className={styles.popupContent}>
          <h3>Are you sure you want to Logout ?</h3>
          <button onClick={onConfirm} style={{backgroundColor:'#17A2B8',color:'white',border:'1px solid #17A2B8', fontWeight:'700'}}>Yes, Logout</button>
          <button onClick={onCancel} style={{backgroundColor:'white',color:'red',border:'1px solid red', fontWeight:'700'}}>Cancel</button>
        </div>
      </div>
    );
}

export default DashboardSidebar