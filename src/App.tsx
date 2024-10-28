import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Transcription from './pages/Transcription/Transcription'
import { ToastContainer } from 'react-toastify'
import Chat from './pages/Chat/Chat'
import { useAuth } from './context/AuthContext'
import Config from './components/Config/SideConfigBar'
import Perfil from './components/Config/Perfil'
import Geral from './components/Config/Geral'
import Chats  from './components/Config/Chats'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

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
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/chat' element={<Chat />} />
            <Route path='/transcription' element={<Transcription />} />
            <Route path='/configuracoes' element={<Config />}>
              <Route path="geral" element={<Geral />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="Chats" element={<Chats />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  )
}

export default App