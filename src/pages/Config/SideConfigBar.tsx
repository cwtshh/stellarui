import { Outlet } from 'react-router-dom';
import chatbg from '../../assets/chatbg.jpeg';
import { useAuth } from '../../context/AuthContext';
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useChat } from '../../context/ChatContext';

export default function Config() {
  const { handleShowSideBar, showSideBar } = useAuth();
  const { adminOpened } = useChat();

  return (
      <div className="relative flex-1 p-8 bg-secondary justify-center items-center flex shadow-inner h-full" style={{
        backgroundImage: `url(${chatbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}>
        
        {adminOpened && (
          <div className='lg:hidden flex absolute h-full left-0 items-center z-50'>
            <div className='bg-gray-600 rounded-tr-xl rounded-br-xl p-1 h-[40px] flex items-center' onClick={() => handleShowSideBar()}>
              {!showSideBar ? (
                <IoIosArrowDropright className='text-green-500 text-[30px]'/>
              ):(
                <IoIosArrowDropleftCircle className='text-green-500 text-[30px]'/>
              )}
            </div>
          </div>
          )}
        <Outlet />
        </div>
  );
}
