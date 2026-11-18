// src/components/DefaultLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const DefaultLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Desktop: ml-20 to offset collapsed sidebar; Mobile: pb-16 for bottom nav */}
      <main className="pb-16 md:pb-0 md:ml-20 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
