import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store';

export function Header() {
  const { currentUser, sidebarCollapsed } = useAppStore();

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-40 transition-all duration-300 flex items-center justify-between px-6 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索单位、隐患、举报..."
            className="w-80 pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors">
          <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-700">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.department}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
