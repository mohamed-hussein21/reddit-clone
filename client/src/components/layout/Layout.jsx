import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';

export default function Layout() {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', paddingTop: 'var(--navbar-height)' }}>
        <LeftSidebar />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
