import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Board.module.css';
import collapseAllIcon from '../../assets/collapseall.png';
import Card from '../Card/Card';
import plusIcon from '../../assets/plus.png'
import deleteIcon from '../../assets/delete.png'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function Board() {
  const MAIN_URL = process.env.REACT_APP_API_URL;
  const storedName = localStorage.getItem('name');
  const [presentDate, setPresentDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [cards, setCards] = useState([]);
  const [filterOption, setFilterOption] = useState('thisWeek');

  useEffect(() => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const year = currentDate.getFullYear();
    const dayWithSuffix =
      day +
      (day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th');
    const formattedDate = `${dayWithSuffix} ${month}, ${year}`;
    setPresentDate(formattedDate);

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
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardMove = async (cardId, newTargetArea) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${MAIN_URL}/update-checklist-area/${cardId}`,
        { targetArea: newTargetArea },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      setCards((prevCards) =>
        prevCards.map((c) =>
          c._id === cardId ? { ...c, targetArea: newTargetArea } : c
        )
      );
    } catch (error) {
      console.error('Error updating checklist area:', error);
    }
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  const filterCards = () => {
    const sortedCards = [...cards].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
    switch (filterOption) {
      case 'today':
        return sortedCards.filter((card) => {
          const createdAt = new Date(card.createdAt);
          const today = new Date();
          return (
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth() &&
            createdAt.getFullYear() === today.getFullYear()
          );
        });
      case 'thisWeek':
        const oneWeekAgo = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
        return sortedCards.filter((card) => {
          const createdAt = new Date(card.createdAt);
          return createdAt >= oneWeekAgo && createdAt <= new Date();
        });
        case 'thisMonth':
          const today = new Date();
          const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDayOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0 );
          return sortedCards.filter((card) => {
            const createdAt = new Date(card.todos.createdAt);
            return createdAt >= firstDayOfThisMonth && createdAt <= lastDayOfThisMonth+1;
        });
      default:
        return sortedCards;
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={styles.header}>
          {storedName ? <h2>Welcome! {storedName}</h2> : <h2>Welcome!</h2>}
        </div>
        <div className={styles.presentDate} style={{ color: '#707070' }}>
          {presentDate}
        </div>
      </div>
      <div className={styles.titleArea}>
        <h1>Board</h1>
        <div className={styles.dropDown}>
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className={styles.dropDownBox}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.sectionArea}>
          {['Backlog', 'ToDo', 'In-Progress', 'Done'].map((area) => (
            <div key={area} className={styles.areas}>
              <div className={styles.areaHeader}>
                <h3>{area}</h3>
                <div className={styles.buttonArea}>
                  {area === 'ToDo' && (
                    <img
                      src={plusIcon}
                      alt="plus"
                      onClick={() => setShowPopUp(true)}
                    ></img>
                  )}
                  <img src={collapseAllIcon} alt="collapse"></img>
                </div>
              </div>
              <div className={styles.cardArea}>
                {filterCards()
                  .filter((card) => {
                    if (area === 'Backlog') {
                      return card.targetArea === 'Backlog';
                    } else if (area === 'ToDo') {
                      return card.targetArea === 'ToDo';
                    } else if (area === 'In-Progress') {
                      return card.targetArea === 'In-Progress';
                    } else if (area === 'Done') {
                      return card.targetArea === 'Done';
                    }
                    return false;
                  })
                  .map((card) => (
                    <Card
                      key={card._id}
                      todos={card}
                      onCardMove={handleCardMove}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {showPopUp && <CreateChecklist onClose={handleClosePopUp} />}
    </div>
  );
}


function CreateChecklist({onClose}) {
  const [title,setTitle] = useState(null);
  const [todos, setTodos] = useState([]);
  const [priority,setPriority] = useState('');
  const [totalTodos, setTotalTodos] = useState(0);
  const [totalChecked, setTotalChecked] = useState(0);
  const [dueDate,setDueDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const MAIN_URL = process.env.REACT_APP_API_URL

  const handleSendTodos = async (e) =>{
    e.preventDefault();
    setLoading(true);

    try{
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${MAIN_URL}/create-todo`,
        {
          title,
          priority,
          todos,
          dueDate,
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );
      setErrors({});
      alert('Todo added Successfully');
      navigate('/dashboard');
      console.log(response.data);
      handleClose();
    }catch (error) {
      console.log('Todo Failed to be added', error.response.data);
      if (error.response.data.error) {
        const errorMessage = error.response.data.error.toLowerCase();
        if (errorMessage.includes('title')) {
            setErrors({ titleAndPriority: error.response.data.error });
            return;
        }
        if (errorMessage.includes('todo')) {
            setErrors({ todo: error.response.data.error });
            return;
        }
        if (errorMessage.includes('unauthorized')){
            setErrors({ notLogged: 'You need to login or Register'});
            return;
        }
    }
    }finally{
      setLoading(false)
    }
  }

  const handlePriorityChange = (priority)=>{
    setPriority(priority);
  }

  const handleDateChange = (date) => {
    setDueDate(date);
  };

  const handleClose = ()=>{
    onClose()
  }

  const addTodo = () => {
    setTotalTodos((prevTotal) => prevTotal + 1);
    setTodos([...todos, { id: Date.now(), text: '', completed: false }]);
  };

  const updateTodo = (id, field, value) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, [field]: value } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTotalTodos((prevTotal) => prevTotal - 1);
    setTotalChecked((prevTotal) => {
      const deletedTodo = todos.find((todo) => todo.id === id);
      return deletedTodo?.completed ? prevTotal - 1 : prevTotal;
    });
    setTodos(updatedTodos);
  };

  const toggleCheck = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    );

    setTotalChecked((prevTotal) =>
      updatedTodos.find((todo) => todo.id === id)?.completed
        ? prevTotal + 1
        : prevTotal - 1
    );

    setTodos(updatedTodos);
  };

  return(
    <div className={styles.popUpContainer}>
      <div className={styles.popUpArea}>
      <div>
        <div className={styles.titleInput}>
          <p style={{fontWeight:'600'}}>Title <span>*</span></p>
          <input type='text' placeholder='Enter Task Title'
            onChange={(e)=>setTitle(e.target.value)}></input>
        </div>
        <div className={styles.priorityArea}>
          <p style={{fontWeight:'600'}}>Select Priority <span>*</span></p>
          <div className={priority === 'HIGH PRIORITY' ? styles.selectedOption : styles.highPriority} onClick={()=>handlePriorityChange('HIGH PRIORITY')}>
            <div className={styles.circle} style={{backgroundColor:'#FF2473'}}></div>
            <div className={styles.priorityName}>
              HIGH PRIORITY
            </div>
          </div>
          <div className={priority === 'MODERATE PRIORITY' ? styles.selectedOption : styles.moderatePriority} onClick={()=>handlePriorityChange('MODERATE PRIORITY')}>
            <div className={styles.circle} style={{backgroundColor:'#18B0FF'}}></div>
            <div className={styles.priorityName}>
              MODERATE PRIORITY
            </div>
          </div>
          <div className={priority === 'LOW PRIORITY' ? styles.selectedOption : styles.lowPriority} onClick={()=>handlePriorityChange('LOW PRIORITY')}>
            <div className={styles.circle} style={{backgroundColor:'#63C05B'}}></div>
            <div className={styles.priorityName}>
              LOW PRIORITY
            </div>
          </div>
        </div>
        <div className={styles.listHeader} style={{fontWeight:'600'}}>Checklist ({totalChecked}/{totalTodos}) <span>*</span></div>
        <div className={styles.checklistInputArea}>
          {todos.map((todo) => (
            <div key={todo.id} className={styles.inputArea} style={{ margin: '10px' }}>
              <input
                className={styles.checkBox}
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCheck(todo.id)}
              />
              <input
                type="text"
                value={todo.text}
                placeholder='Add Text'
                onChange={(e) => updateTodo(todo.id, 'text', e.target.value)}
              />
              <img src={deleteIcon} alt='' style={{cursor:'pointer'}} onClick={() => deleteTodo(todo.id)}></img>
            </div>
          ))}
        </div> 
        <button onClick={addTodo}
        style={{width:'140px',fontSize:'18px',padding:'10px',border:'none',cursor:'pointer',color:'#767575'}}>+ Add Todo</button>
        {errors.titleAndPriority && <p className={styles.errorMsg}>{errors.titleAndPriority}</p>}
        {errors.todo && <p className={styles.errorMsg}>{errors.todo}</p>}
        {errors.notLogged && <p className={styles.errorMsg}>{errors.notLogged}</p>}
      </div>
        <div className={styles.footer}>
            <div className={styles.dueDate}>
            <DatePicker className={styles.datePicker}
              selected={dueDate}
              onChange={handleDateChange}
              placeholderText="Select due date"
              showPopperArrow={false}
            /></div>
            <button onClick={handleClose} style={{marginLeft:'80px',border:'2px solid red',color:'red'}}>Close</button>
            <button style={{border:'2px solid #17A2B8',color:'white',backgroundColor:'#17A2B8'}}
            onClick={handleSendTodos}
            >{loading ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  )
}

export default Board;


