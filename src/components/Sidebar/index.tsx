import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Wallet, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Brain,
  LogOut
} from 'lucide-react';
import { MenuItem } from './MenuItem';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { id: 'trading', icon: LineChart, label: 'Trading', path: '/trading' },
  { id: 'portfolio', icon: Wallet, label: 'Portfolio', path: '/portfolio' },
  { id: 'alerts', icon: Bell, label: 'Alertas', path: '/alerts' },
  { id: 'settings', icon: Settings, label: 'Ajustes', path: '/settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              CriptoJarviS
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              {isCollapsed ? (
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="p-3 rounded-lg w-full flex justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ) : (
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  onClick={() => handleNavigation(item.path)}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${
            isCollapsed ? 'px-2' : 'px-4'
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}