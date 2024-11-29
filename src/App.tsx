import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Transcription from './pages/Transcription/Transcription'
import { ToastContainer } from 'react-toastify'
import Chat from './pages/Chat/Chat'
import { useAuth } from './context/AuthContext'
import Config from './pages/Config/SideConfigBar'
import Perfil from './pages/Config/Perfil'
import Geral from './pages/Config/Geral'
import Chats from './pages/Config/Chats/Chats'
import Archived from './pages/Chat/Archived'
import ModelList from './pages/Config/Model/ModelList'
import ModelSelector from './pages/Config/Model/ModelSelector'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
// import AutoAuthSolar from './pages/AutoAuthSolar/AutoAuthSolar'

function App() {
  const { user } = useAuth();
  return (
    <div className='flex h-full overflow-hidden w-full'>
      <BrowserRouter>
        { user ? <SideBar /> : null }
        <Routes>
          <Route path="/" element={<Navigate to={'/login'} />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/chat' element={<Chat />} />
            <Route path='/Archived/:chatId' element={<Archived />} />
            <Route path='/transcription' element={<Transcription />} />
            <Route path='/configuracoes' element={<Config />}>
              <Route path="geral" element={<Geral />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="Chats" element={<Chats />} />
              <Route path="listmodel" element={<ModelList />} />
              <Route path="ModelSelector" element={<ModelSelector />} />
            </Route>
          </Route>

          {/* <Route path='/solar/:nome/:email' element={<AutoAuthSolar />} /> */}
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  )
}

export default App
