import './App.css';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import EditData from './components/EditData/EditData';
import View from './pages/View/View'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/> } />
          <Route path='/register' element={<Register/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/dashboard/edit-checklist' element={<EditData/>}/>
          <Route path='/view/:checklistId' element={<View/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
