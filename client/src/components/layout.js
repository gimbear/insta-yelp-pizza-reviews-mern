import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

const Layout = () => {
  return (
    <main className="mx-5 my-4">
      <Navbar />
      <Outlet />
    </main>
  );
};

export default Layout;
