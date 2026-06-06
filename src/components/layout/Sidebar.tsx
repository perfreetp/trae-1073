import { NavLink } from 'react-router-dom';
import {
  Map,
  Building2,
  ClipboardList,
  AlertTriangle,
  GraduationCap,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Flame,
  FileCheck
} from 'lucide-react';
import { useAppStore } from '@/store';

const menuItems = [
  { path: '/', icon: Map, label: '风险地图' },
  { path: '/units', icon: Building2, label: '单位档案' },
  { path: '/inspections', icon: ClipboardList, label: '检查计划' },
  { path: '/hazards', icon: AlertTriangle, label: '隐患整改' },
  { path: '/self-check', icon: FileCheck, label: '物业自查' },
  { path: '/training', icon: GraduationCap, label: '宣传培训' },
  { path: '/reports', icon: MessageSquare, label: '举报受理' },
  { path: '/analytics', icon: BarChart3, label: '数据分析' }
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="font-bold text-lg">消防隐患治理</h1>
              <p className="text-xs text-slate-400">城市消防安全管理平台</p>
            </div>
          )}
        </div>
      </div>

      <nav className="mt-4 px-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${sidebarCollapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center border-2 border-slate-900 transition-colors"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        {!sidebarCollapsed && (
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">待处理事项</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">12 项待处理</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
