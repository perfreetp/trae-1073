import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppStore } from '@/store';

export function Layout() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <Header />
      <main
        className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
