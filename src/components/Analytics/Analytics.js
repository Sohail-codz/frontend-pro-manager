import React,{ useEffect,useState } from 'react'
import styles from '../Analytics/Analytics.module.css'
import axios from 'axios'

function Analytics() {
  const MAIN_URL = process.env.REACT_APP_API_URL;
  const [cards, setCards] = useState([]);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${MAIN_URL}/todos`, {
          headers: {
            token: `${token}`,
          },
        });
        setCards(response.data.todos || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const backlogTasksCount = cards.filter((card) => card.targetArea === 'Backlog').length;
  const todoTasksCount = cards.filter((card) => card.targetArea === 'ToDo').length;
  const inProgressTasksCount = cards.filter((card) => card.targetArea === 'In-Progress').length;
  const completedTasksCount = cards.filter((card) => card.targetArea === 'Done').length;

  const lowPriorityTasksCount = cards.filter((card) => card.priority === 'LOW PRIORITY').length;
  const moderatePriorityTasksCount = cards.filter((card) => card.priority === 'MODERATE PRIORITY').length;
  const highPriorityTasksCount = cards.filter((card) => card.priority === 'HIGH PRIORITY').length;

  const dueDateTasksCount = cards.filter((card) => card.dueDate !== null).length;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Analytics</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.numbersArea}>
          <ul>
            <div className={styles.areas}>
              <li>Backlog Tasks</li>
              <h3>{backlogTasksCount}</h3>
            </div>
            <div className={styles.areas}>
              <li>To-do Tasks</li>
              <h3>{todoTasksCount}</h3>
            </div>
            <div className={styles.areas}>
              <li>In-Progress Tasks</li>
              <h3>{inProgressTasksCount}</h3>
            </div>
            <div className={styles.areas}>
              <li>Completed Tasks</li>
              <h3>{completedTasksCount}</h3>
            </div>
          </ul>
          <ul>
            <div className={styles.areas}>
              <li>Low Priority</li>
              <h3>{lowPriorityTasksCount}</h3>
            </div>
            <div className={styles.areas}>
              <li>Moderate Priority</li>
              <h3>{moderatePriorityTasksCount}</h3>
            </div>
            <div className={styles.areas}>
              <li>High Priority</li>
              <h3>{highPriorityTasksCount}</h3>
            </div>
            <div className={styles.areas}>
              <li>Due Date Tasks</li>
              <h3>{dueDateTasksCount}</h3>
            </div>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Analytics