// src/components/DefaultLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Importe a navbar

const DefaultLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
