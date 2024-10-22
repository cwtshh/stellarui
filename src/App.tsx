import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import SideBar from './components/SideBar/SideBar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Transcription from './pages/Trancription/Trancription'
import { ToastContainer } from 'react-toastify'
import Chat from './pages/Chat/Chat'
import { useAuth } from './context/AuthContext'
import Config from './components/Config/SideBar'
import Perfil from './components/Config/Perfil'
import Geral from './components/Config/Geral'
import AdminPainel from './components/Config/AdminPainel'
import Chats  from './components/Config/Chats'

function App() {
  const { user } = useAuth();
  return (
    <div className='flex h-full w-full'>
      <BrowserRouter>
        { user ? <SideBar /> : null }
        <Routes>
          <Route path="/" element={<Navigate to={'/login'} />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/configuracoes' element={<Config />}>
            <Route path="geral" element={<Geral />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="AdminPainel" element={<AdminPainel />} />
            <Route path="Chats" element={<Chats />} />
          </Route>
          <Route path='/transcription' element={<Transcription />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  )
}

export default App