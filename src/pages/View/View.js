import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './View.module.css';
import mainicon from '../../assets/mainLogo.png'

function View() {
  const MAIN_URL = process.env.REACT_APP_API_URL;
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalTodos, setTotalTodos] = useState(0);
  const [completedTodos, setCompletedTodos] = useState(0);

  const { checklistId } = useParams();

  const addOrdinalSuffix = (number) => {
    const j = number % 10;
    const k = number % 100;
  
    if (j === 1 && k !== 11) {
      return number + 'st';
    }
    if (j === 2 && k !== 12) {
      return number + 'nd';
    }
    if (j === 3 && k !== 13) {
      return number + 'rd';
    }
    return number + 'th';
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const formattedDate = `${month} ${addOrdinalSuffix(day)}`;
    return formattedDate;
  };

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await axios.get(`${MAIN_URL}/get-checklist/${checklistId}`);
        setChecklist(response.data.checklist);

        const total = response.data.checklist.todos.length;
        const completed = response.data.checklist.todos.filter(todo=> todo.completed).length;
        setTotalTodos(total);
        setCompletedTodos(completed);
      } catch (error) {
        console.error('Error fetching checklist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [MAIN_URL, checklistId]);

  return (
    <>
    <div className={styles.header}>
        <img src={mainicon} alt=''></img>
        <h1>Pro Manager</h1>
    </div>
    <div className={styles.container}>
      {loading && <p>Loading...</p>}
      {!loading && !checklist && <h1>Not found</h1>}
      {checklist && (
        <div className={styles.contentContainer}>
          <div className={styles.priorityHeader}>
            <div className={styles.circle} style={{
              backgroundColor:
                checklist.priority === 'HIGH PRIORITY'
                ? '#FF2473'
                : checklist.priority === 'MODERATE PRIORITY'
                ? '#18B0FF'
                : checklist.priority === 'LOW PRIORITY'
                ? '#63C05B'
                : 'transparent', 
            }}></div>
            <div className={styles.priorityName}>
              {checklist.priority || 'No Priority'}
            </div>
          </div>
          <h1 className={styles.title}>{checklist.title}</h1>
          <p className={styles.checklistHeader}>Checklist ({completedTodos}/{totalTodos})</p>
          <div className={styles.checklistContentArea}>
              {checklist.todos.map((todo) => (
                <div key={todo._id} className={styles.checklistContent}>
                  <input type="checkbox" checked={todo.completed} readOnly/>
                  <p style={{marginLeft:'10px',fontWeight:'500'}}>{todo.text}</p>
                </div>
              ))}
            </div>
         {checklist.dueDate && (
          <p className={styles.dueDate}>Due Date <span className={styles.dateArea}>{formatDueDate(checklist.dueDate)}</span></p>
         )}
        </div>
      )}
    </div>
    </>
  );
}

export default View;