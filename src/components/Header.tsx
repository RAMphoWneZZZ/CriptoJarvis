import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Header() {
  const { isDark, toggleTheme } = useTheme(); // Detectar tema y función para alternar

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Cambiar logo según el tema */}
            <img
              src={isDark ? "src/images/CriptoJarvis-Logo.png" : "src/images/CriptoJarvis-Logo-Negativo.png"}
              alt="CriptoJarviS Logo"
              className="w-1/5 h-1/5"
            />
          </div>

          {/* Botón para alternar tema */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cambiar tema"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
