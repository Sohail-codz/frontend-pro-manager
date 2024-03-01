import React, { useState } from 'react';
import styles from '../../components/Settings/Settings.module.css'
import axios from 'axios';
import nameIcon from '../../assets/user.png';
import lockIcon from '../../assets/lock.png';
import visibilityIcon from '../../assets/visibility.png'

const Settings = () => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [visibleOldPass, setVisibleOldPass] = useState(false)
  const [visibleNewPass, setVisibleNewPass] = useState(false)

  const presentName = localStorage.getItem('name')

  const handleUpdate = async (e) => { 
    e.preventDefault()
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/update`,
        {
          name,
          oldPassword,
          newPassword,
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );
      setErrors({});
      alert('Updates Successful')
      localStorage.setItem('name', response.data.User_Name);
      console.log(response.data.User_Name);
    } catch (error) {
      console.log('Login failed:', error.response.data);
      if (error.response.data.error) {
          const errorMessage = error.response.data.error.toLowerCase();
          if (errorMessage.includes('either')) {
              setErrors({ both: error.response.data.error });
              return;
          }
          if (errorMessage.includes('incorrect')) {
              setErrors({ password: error.response.data.error });
              return;
          }
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Settings</h1>
      <form className={styles.options}>
        <div className={styles.nameArea}>
          <img src={nameIcon} alt='userico'></img>
          <input
            type="text"
            value={name}
            placeholder={presentName ? presentName : 'Name'}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.confirmPasswordArea}>
          <img src={lockIcon} alt='lockico'></img>
          <input
            type={visibleOldPass ? 'text' : 'password'}
            value={oldPassword}
            placeholder='Old Password'
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <img src={visibilityIcon} alt='visibilityico' style={{cursor:'pointer'}}
          onClick={() => setVisibleOldPass(!visibleOldPass)}></img>
        </div>
        <div className={styles.newPasswordArea}>
          <img src={lockIcon} alt='lockico'></img>
          <input
            type={visibleNewPass ? 'text' : 'password'}
            value={newPassword}
            placeholder='New Password'
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <img src={visibilityIcon} alt='visibilityico' style={{cursor:'pointer'}}
          onClick={() => setVisibleNewPass(!visibleNewPass)}></img>
        </div>
        {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
        {errors.both && <p className={styles.errorMsg}>{errors.both}</p>}
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update'}
      </button>
      </form>
    </div>
  );
};

export default Settings;
