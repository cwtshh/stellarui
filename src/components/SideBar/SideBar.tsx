import React from 'react'
import { BiLogOut } from 'react-icons/bi'
import { GrConfigure, GrUserAdmin } from 'react-icons/gr'
import { HiMiniPencilSquare } from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'
import { useChat } from '../../context/ChatContext'
import ChatCard from '../ChatCard/ChatCard'
import { BsStars } from 'react-icons/bs'
import logo from '../../assets/DPDF_Branca 1.png'

const SideBar = () => {
    const { logout, user } = useAuth();
    const { chats, add_chat } = useChat();

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

                <button className='btn' onClick={() => add_chat()}>
                    Criar novo chat
                    <HiMiniPencilSquare className='text-xl' />
                </button>
                <button className='btn'>Workspace</button>

                <div>
                    <p className='font-bold text-white'>Chats Ativos</p>
                        {/* TODO ordenar de tras pra frente */}
                    <div className='flex flex-col gap-6 mt-2 overflow-y-scroll max-h-[40rem]'>
                        { chats?.map((chat, index) => (
                            <ChatCard chat={chat} key={index} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="dropdown dropdown-top flex flex-col">
                <div tabIndex={0} role="button" className="btn m-1">{user?.name}</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                        <a>
                            <GrConfigure className='mr-2' />
                            Configuracoes
                        </a>
                    </li>
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