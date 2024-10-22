import React from 'react'
import { BiLogOut } from 'react-icons/bi'
import { GrConfigure, GrUserAdmin } from 'react-icons/gr'
import { HiMiniPencilSquare } from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'
import { useChat } from '../../context/ChatContext'
import ChatCard from '../ChatCard/ChatCard'
import { BsStars } from 'react-icons/bs'
import logo from '../../assets/DPDF_Branca 1.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaUser, FaVideo } from 'react-icons/fa'
import { IoChatboxEllipses } from 'react-icons/io5'
import { Outlet, Link } from 'react-router-dom';


const SideBar = () => {
    const { chats, add_chat, lockChat } = useChat();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActivePage = (path: string) => {
        return location.pathname === path;
    }

    const isActiveConfPage = (path: string) => {
        return location.pathname.startsWith(path);
    }

    return (
        <div className='bg-primary w-[20%] p-5 flex flex-col justify-between shadow-[4px_0_5px_rgba(0,0,0,0.50)] z-50'>
            <div className='flex flex-col gap-5'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-2'>
                        <h1 className='font-bold text-2xl text-white'>Stellar</h1>
                        <BsStars className='text-2xl text-white' />
                    </div>
                    <img className='w-12' src={logo} alt="" />
                </div>

                {isActivePage('/chat') ? (

                    <button className='btn' onClick={() => navigate('/transcription')}>
                        Transcrição de Vídeo
                        <FaVideo />    
                    </button>
                ) : (
                    <button className='btn' onClick={() => navigate('/chat')}>
                        Voltar ao chat
                        <IoChatboxEllipses />
                    </button>
                )}


                {!isActiveConfPage('/configuracoes') ? (
                <>
                    <button disabled={lockChat} className='btn' onClick={() => {
                        add_chat() 
                        navigate('/chat')}}>
                        Criar novo chat
                        <HiMiniPencilSquare className='text-xl' />
                    </button>
                    <div>
                        <p className='font-bold text-white'>Chats Ativos</p>
                        <div className='scroll-hidden flex flex-col gap-6 mt-2 overflow-y-scroll h-full max-h-[40rem]'>
                            { chats?.map((chat, index) => (
                                <ChatCard chat={chat} key={index} />
                            ))} 
                        </div>
                    </div>
                </>
                ):(
                <div>
                    <p className='font-bold text-white'>Configurações</p>
                    <ul className="space-y-4">
                        <li><Link to="/configuracoes/geral" className="text-green-200 hover:text-green-100 transition-colors duration-200">General</Link></li>
                        <li><Link to="/configuracoes/perfil" className="text-green-200 hover:text-green-100 transition-colors duration-200">Profile</Link></li>
                        <li><Link to="/configuracoes/AdminPainel" className="text-green-200 hover:text-green-100 transition-colors duration-200">Admin Panel</Link></li>
                        <li><Link to="/configuracoes/Chats" className="text-green-200 hover:text-green-100 transition-colors duration-200">Chats</Link></li>
                    </ul>
                </div>
                )}
            </div>
            <div className="dropdown dropdown-top flex flex-col">
                <div tabIndex={0} role="button" className="btn m-1">
                    {user?.name}
                    <FaUser />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[90%] p-2 shadow absolute left-1/2 transform -translate-x-1/2">
                    {!isActiveConfPage('/configuracoes') ? (
                    <li>
                        <a href='/configuracoes'>
                            <GrConfigure className='mr-2' />
                            Configurações
                        </a>
                    </li>
                    ) : (
                        <>
                        </>
                    )}
                    { user?.role === 'admin' && ( 
                        <li>
                            <a>
                                <GrUserAdmin className='mr-2' />
                                Painel de Admin
                            </a>
                        </li>
                    )}
                    <li>
                        <button onClick={() => logout()}>
                            <BiLogOut className='mr-2' />
                            Sair
                        </button>
                    </li>
                </ul>
            </div>
            {/* <button className='btn'>
                USUARIO
            </button> */}           
        </div>
  )
}

export default SideBar