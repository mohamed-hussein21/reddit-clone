import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';

export default function Layout() {
  return (
    <>
      <Navbar />

      <div className="app-layout">
        <LeftSidebar />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}