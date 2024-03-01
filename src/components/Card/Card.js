import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Card.module.css';
import tripledoticon from '../../assets/tripledot.png';
import arrowupicon from '../../assets/arrowup.png';
import arrowdownicon from '../../assets/arrowdown.png';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css'; 

function Card({ todos, onCardMove }) {
  const MAIN_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const [expand, setExpand] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [showDeletPopUp,setShowDeletePopUp] = useState(false);
  const [loading,setLoading] = useState(false);

  const generateOptions = (targetArea) => {
    const allAreas = ['Backlog', 'ToDo', 'In-Progress', 'Done'];
    return allAreas
      .filter((area) => area !== targetArea)
      .map((option) => (
        <div
          key={option}
          className={styles.options}
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </div>
      ));
  };

  const handleOptionClick = (newTargetArea) => {
    onCardMove(todos._id, newTargetArea);
  };

  const handleShowDeletePopUp = ()=>{
    setShowDeletePopUp(true);
  }

  const handleOnConfirmDelete = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const checklistId = todos._id;
      const token = localStorage.getItem('token');
      await axios.delete(`${MAIN_URL}/delete-checklist/${checklistId}`,{
        headers: {
          token: `${token}`,
        },
      });
      window.location.reload();
      setShowDeletePopUp(false)
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  const handleCloseDeletePopUp = ()=>{
    setShowDeletePopUp(false);
  }

  const handleToEditDataPage = () =>{
    localStorage.setItem('checklistId', todos._id)
    navigate('/dashboard/edit-checklist')
  }

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/view/${todos._id}`;
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        toast.success('Link Copied!', { position:'top-right', autoClose: 1000 });
        console.log('Link copied to clipboard:', shareLink);
      })
      .catch((error) => {
        console.error('Error copying link to clipboard:', error);
      });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.priorityHeader}>
            <div className={styles.circle} style={{
              backgroundColor:
                todos.priority === 'HIGH PRIORITY'
                  ? '#FF2473'
                  : todos.priority === 'MODERATE PRIORITY'
                  ? '#18B0FF'
                  : todos.priority === 'LOW PRIORITY'
                  ? '#63C05B'
                  : 'transparent', 
            }}></div>
            <div className={styles.priorityName}>
              {todos.priority || 'No Priority'}
            </div>
          </div>
          <img
            src={tripledoticon}
            alt=""
            style={{ cursor: 'pointer' }}
            onClick={() => setShowExtra(!showExtra)}
          ></img>
          {showExtra && (
            <div className={styles.extraOptions}>
              <div onClick={handleToEditDataPage}>Edit</div>
              <div onClick={handleCopyLink}>Share</div>
              <div style={{ color: 'red' }} onClick={handleShowDeletePopUp}>Delete</div>
            </div>
          )}
        </div>
        <div className={styles.titleHeader}>
          <h3>{todos.title || 'No Title'}</h3>
        </div>
        <div className={styles.checklistArea}>
          <div className={styles.checklistHeader}>
            <h4>Checklist({todos.todos.filter(item => item.completed).length}/{todos.todos.length})</h4>
            <div
              className={styles.arrowArea}
              onClick={() => setExpand(!expand)}
            >
              {expand ? (
                <img src={arrowupicon} alt="up"></img>
              ) : (
                <img src={arrowdownicon} alt="down"></img>
              )}
            </div>
          </div>
          {expand && (
            <div className={styles.checklistContentArea}>
              {todos.todos.map((todoItem) => (
                <div key={todoItem._id} className={styles.checklistContent}>
                  <input type="checkbox" checked={todoItem.completed} readOnly/>
                  <p style={{marginLeft:'10px',flexWrap:'wrap'}}>{todoItem.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.footer}>
        <div className={styles.dueDate} style={{
            backgroundColor:
                todos.targetArea === 'Done'
                  ? todos.dueDate === null
                    ? 'white'
                    : 'green'
                  : todos.dueDate === null
                  ? 'white'
                  : new Date(todos.dueDate).setHours(0, 0, 0, 0) >=
                    new Date().setHours(0, 0, 0, 0)
                  ? 'lightgrey'
                  : 'red',
              color:
                todos.targetArea === 'Done'
                  ? 'white'
                  : todos.dueDate === null
                  ? 'white'
                  : new Date(todos.dueDate).setHours(0, 0, 0, 0) >=
                    new Date().setHours(0, 0, 0, 0)
                  ? 'black'
                  : 'white',
            }}>
            {todos.dueDate &&
              new Date(todos.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
          </div>
          <div className={styles.targetAreas}>
            {generateOptions(todos.targetArea)}
          </div>
        </div>
        { showDeletPopUp && (
          <DeletePopup
            onConfirm={handleOnConfirmDelete}
            onCancel={handleCloseDeletePopUp}
            onLoading={loading}
            />
        )}
        <ToastContainer/>
      </div>
    </>
  );
}

function DeletePopup({ onConfirm, onCancel, onLoading }) {
  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <h3>Are you sure you want to Delete ?</h3>
        <button onClick={onConfirm} style={{backgroundColor:'#17A2B8',color:'white',border:'1px solid #17A2B8', fontWeight:'700'}}>
        {onLoading ? 'Deleting...' : 'Yes, Delete'}
        </button>
        <button onClick={onCancel} style={{backgroundColor:'white',color:'red',border:'1px solid red', fontWeight:'700'}}>Cancel</button>
      </div>
    </div>
  );
}

export default Card;