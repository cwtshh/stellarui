import { Outlet } from 'react-router-dom';
import chatbg from '../../assets/chatbg.jpeg';

export default function Config() {
  return (
      <div className="relative flex-1 p-8 bg-secondary shadow-inner h-full" style={{
        backgroundImage: `url(${chatbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}>
        <Outlet />
      </div>
  );
}
