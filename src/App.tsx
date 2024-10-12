import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import SideBar from './components/SideBar/SideBar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { ToastContainer } from 'react-toastify'
import Chat from './pages/Chat/Chat'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth();
  return (
    <div className='flex h-full w-full'>
      <BrowserRouter>
      { user ? <SideBar /> : null }
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/chat' element={<Chat />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>

    </div>
  )
}

export default App
