import { Outlet } from 'react-router-dom';

export default function Config() {
  return (
      <div className="flex-1 p-8 bg-secondary shadow-inner">
        <Outlet />
      </div>
  );
}
