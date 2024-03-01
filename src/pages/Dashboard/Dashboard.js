import React,{ useState,useEffect } from 'react'
import styles from '../Dashboard/Dashboard.module.css'
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar'
import Board from '../../components/Board/Board'
import Analytics from '../../components/Analytics/Analytics'
import Settings from '../../components/Settings/Settings'
import useProManagerContext from '../../context/useProManagerContext'

function Dashboard() {
  const [selectedOption, setSelectedOption]=useState('Board');
  const { loggedIn, setLoggedIn, } = useProManagerContext();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token); 
    console.log(loggedIn);
  }, [loggedIn, setLoggedIn]);

  useEffect(()=>{
    setTimeout(() => {
      localStorage.clear();
    }, 60*60*1000);
  },)

  const handleOptionChange = (option)=>{
    setSelectedOption(option)
  }

  return (
    <div className={styles.container}>
      <DashboardSidebar onOptionChange={handleOptionChange}/>
      {selectedOption === 'Board' ? (<Board/>) : selectedOption === 'Analytics' ? (<Analytics/>) : selectedOption === 'Settings' ? (<Settings/>) : (<Board/>)}
    </div>
  )
}

export default Dashboard