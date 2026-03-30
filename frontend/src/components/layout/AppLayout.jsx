import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../../styles/AppLayout.scss';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <section className="content-panel">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AppLayout;
