import React, { useState, useEffect } from 'react';
import styles from '../EditData/EditData.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import mainicon from '../../assets/mainLogo.png';

function EditData() {
  const MAIN_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(null); // Initialize with null
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchChecklistData = async () => {
      try {
        const token = localStorage.getItem('token');
        const checklistId = localStorage.getItem('checklistId');
        const response = await axios.get(`${MAIN_URL}/get-checklist-to-update/${checklistId}`, {
          headers: {
            token: `${token}`,
          },
        });

        const checklistData = response.data.checklist;
        setTitle(checklistData.title);
        setPriority(checklistData.priority);
        setDueDate(checklistData.dueDate ? new Date(checklistData.dueDate) : null);
        setTodos(checklistData.todos);
      } catch (error) {
        console.error('Error fetching checklist data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklistData();
  }, [MAIN_URL]);

  const handleCheckboxChange = (taskId) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === taskId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const handlePriorityChange = (selectedPriority) => {
    setPriority(selectedPriority);
    // You can add additional logic if needed
  };

  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  const handleSaveChanges = async () => {
    setLoading(true)
    const token = localStorage.getItem('token');
    const checklistId = localStorage.getItem('checklistId');
    try {
      await axios.put(
        `${MAIN_URL}/update-checklist/${checklistId}`,
        {
          title,
          priority,
          dueDate: dueDate ? dueDate.toISOString() : null, // Convert to ISO string
          todos,
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );
      setLoading(false);
      alert('Details Updated');
      localStorage.removeItem('checklistId');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating checklist:', error);
    } finally{
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/dashboard');
    localStorage.removeItem('checklistId');
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <img src={mainicon} alt=''></img>
        <h1 className={styles.header}>UPDATE CHECKLIST</h1>
      </div>
      <div>

      <div className={styles.priorityArea}>
          <p style={{ fontWeight: '600' }}>Select Priority: </p>
          <div
          className={
            priority === 'HIGH PRIORITY'
              ? styles.selectedOption
              : styles.highPriority
          }
          onClick={() => handlePriorityChange('HIGH PRIORITY')}
          >
          <div
            className={styles.circle}
            style={{ backgroundColor: '#FF2473' }}
          ></div>
          <div className={styles.priorityName}>HIGH PRIORITY</div>
          </div>
          <div
            className={
              priority === 'MODERATE PRIORITY'
                ? styles.selectedOption
                : styles.moderatePriority
            }
            onClick={() => handlePriorityChange('MODERATE PRIORITY')}>
            <div
              className={styles.circle}
              style={{ backgroundColor: '#18B0FF' }}
            ></div>
            <div className={styles.priorityName}>MODERATE PRIORITY</div>
          </div>
          <div
            className={
              priority === 'LOW PRIORITY'
                ? styles.selectedOption
                : styles.lowPriority
            }
            onClick={() => handlePriorityChange('LOW PRIORITY')}
          >
            <div
              className={styles.circle}
              style={{ backgroundColor: '#63C05B' }}
            ></div>
            <div className={styles.priorityName}>LOW PRIORITY</div>
          </div>
        </div>

        <div className={styles.titleArea}>
          <p className={styles.titleHeader}>Title:</p>
          <input
            type="text"
            value={title}
            placeholder={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div className={styles.todoHeader} style={{marginTop:'10px',padding:'10px',fontWeight:'700'}}>(Update The Todo Checks)</div>
        {todos.map((todo) => (
          <div key={todo.id} className={styles.todosArea}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleCheckboxChange(todo.id)}
          />
          <p className={styles.textTodo}>{todo.text}</p>
          </div>
        ))}

        <div className={styles.datePickerArea}>
          <p style={{ fontWeight: '600' }}>Due Date: </p>
          <DatePicker
            className={styles.dateArea}
            selected={dueDate}
            onChange={handleDueDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select due date"
          />
        </div>
        <div className={styles.buttonArea}>
          <button onClick={handleSaveChanges} style={{backgroundColor:'#17A2B8',color:'white',border:'1px solid #17A2B8'}}>
          { loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={handleClose} style={{color:'red',border:'1px solid red'}}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default EditData;