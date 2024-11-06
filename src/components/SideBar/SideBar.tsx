import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { GrConfigure } from 'react-icons/gr';
import { HiMiniPencilSquare } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { RiChatSettingsFill } from "react-icons/ri";
import { IoChatboxEllipses } from 'react-icons/io5';
import { MdOutlineSettings } from "react-icons/md";
import logo from '../../assets/DPDF_Branca 1.png';
import { FaUser, FaVideo } from 'react-icons/fa';
import AdminModal from '../../pages/Config/ModalAdmin';
import ChatCard from '../ChatCard/ChatCard';
import { useEffect, useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from 'react-icons/bi';
import { BsStars } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const SideBar = () => {
    const { chats, add_chat, lockChat } = useChat();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const isActivePage = (path: string) => {
        return location.pathname === path;
    };

    const isActiveConfPage = (path: string) => {
        return location.pathname.startsWith(path);
    };

    useEffect(() => {
        if(location.pathname === '/configuracoes'){
            navigate('configuracoes/geral');
        }
    }, [location, navigate])

    return (
        <div className='bg-primary min-w-[350px] p-5 flex flex-col justify-between shadow-[4px_0_5px_rgba(0,0,0,0.50)] z-50'>
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
                        {chats.length > 1 ? (
                            <p> Voltar aos Chats</p>
                        ) : (
                            <p>
                                Voltar ao Chat
                            </p>
                        )}
                        <IoChatboxEllipses />
                    </button>
                )}

                {!isActiveConfPage('/configuracoes') ? (
                    <>
                        <button disabled={lockChat} className='btn' onClick={() => {
                            add_chat(); 
                            navigate('/chat');
                        }}>
                            Criar novo chat
                            <HiMiniPencilSquare className='text-xl' />
                        </button>
                        <div>
                            {chats && chats.length > 0 ? (
                                <>
                                    <p className='font-bold text-white'>Chats Ativos</p>
                                    <div className='scroll-hidden flex flex-col gap-6 mt-2 overflow-y-scroll h-full max-h-[40rem]'>
                                        {chats.map((chat, index) => (
                                            <ChatCard chat={chat} key={index} />
                                        ))} 
                                    </div>
                                </>
                            ) : (
                                <></> 
                            )}
                        </div>
                    </>
                ) : (
                    <div>
                        <p className='font-bold text-white mb-4'>Configurações</p>
                        <ul className="space-y-4 flex flex-col">
                            <Link to="/configuracoes/geral">
                                <li className={`${isActivePage('/configuracoes/geral') && !isModalOpen ? 'bg-secondary' : ''} hover:bg-secondary h-full p-3 rounded-xl text-green-200 transition-colors duration-200`}>
                                    <div className='flex gap-4 items-center'>
                                        <MdOutlineSettings />
                                        General
                                    </div>
                                </li>
                            </Link>
                            <Link to="/configuracoes/modelselector">
                                <li className={`${isActivePage('/configuracoes/modelselector') && !isModalOpen ? 'bg-secondary' : ''} hover:bg-secondary h-full p-3 rounded-xl text-green-200 transition-colors duration-200`}>
                                    <div className='flex gap-4 items-center'>
                                        <BsStars />
                                        Model Settings
                                    </div>
                                </li>
                            </Link>
                            <Link to="/configuracoes/perfil">
                                <li className={`${isActivePage('/configuracoes/perfil') && !isModalOpen ? 'bg-secondary' : ''} hover:bg-secondary h-full p-3 rounded-xl text-green-200 transition-colors duration-200`}>
                                    <div className='flex gap-4 items-center'>
                                        <CgProfile />
                                        Profile
                                    </div>
                                </li>
                            </Link>
                            <Link to="/configuracoes/Chats">
                                <li className={`${isActivePage('/configuracoes/Chats') && !isModalOpen ? 'bg-secondary' : ''} hover:bg-secondary  h-full p-3 rounded-xl text-green-200 transition-colors duration-200`}>
                                    <div className='flex gap-4 items-center'>
                                        <RiChatSettingsFill />
                                        Chats
                                    </div>
                                </li>
                            </Link>
                            { user?.role === 'admin' && (
                                <li className={`${isModalOpen ? 'bg-secondary' : ''} hover:bg-secondary  h-full p-3 rounded-xl text-green-200 transition-colors duration-200 cursor-pointer`} onClick={openModal}>
                                    <div className='flex gap-4 items-center'>
                                        <MdOutlineAdminPanelSettings />
                                        Admin Panel
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
               
                )}
            </div>
            <div className="dropdown dropdown-top flex flex-col">
                <div tabIndex={0} role="button" className="btn m-1">
                    {user?.name}
                    <FaUser />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[300px] p-2 shadow absolute left-1/2 transform -translate-x-1/2">
                    {!isActiveConfPage('/configuracoes') ? (
                        <li>
                            <a href='/configuracoes'>
                                <GrConfigure className='mr-2' />
                                Configurações
                            </a>
                        </li>
                    ) : (
                        <></>
                    )}
                    <li>
                        <button onClick={() => logout()}>
                            <BiLogOut className='mr-2' />
                            Sair
                        </button>
                    </li>
                </ul>
            </div>
            <AdminModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default SideBar;
