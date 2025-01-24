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
  LogOut,
  Menu
} from 'lucide-react';
import { useAuthStore } from '../store/authStore'; // Ajusta la ruta según tu proyecto

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuthStore(); // Manejo de autenticación
  const navigate = useNavigate(); // Navegación con rutas

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'trading', icon: LineChart, label: 'Trading', path: '/trading' },
    { id: 'portfolio', icon: Wallet, label: 'Portfolio', path: '/portfolio' },
    { id: 'alerts', icon: Bell, label: 'Alertas', path: '/alerts' },
    { id: 'settings', icon: Settings, label: 'Ajustes', path: '/settings' },
  ];

  // Función para manejar la navegación por rutas
  const handleNavigation = (path: string, sectionId: string) => {
    onSectionChange(sectionId); // Actualizar la sección activa
    navigate(path); // Navegar a la ruta correspondiente
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Redirigir al login después del logout
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Encabezado */}
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

      {/* Menú */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.path, item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
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
