import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    if (!localStorage.getItem('theme-storage')) {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    mediaQuery.addEventListener('change', handleChange);
    setIsLoading(false);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleToggle = () => {
    setIsChanging(true);
    setTheme(theme === 'light' ? 'dark' : 'light');
    setTimeout(() => setIsChanging(false), 300);
  };

  if (isLoading) {
    return (
      <div className="w-10 h-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        relative w-10 h-10 rounded-lg
        bg-gray-100 dark:bg-gray-800
        hover:bg-gray-200 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        transition-colors duration-200
        ${isChanging ? 'scale-95' : 'scale-100'}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span className="sr-only">
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
      </span>
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200">
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-amber-600" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400" />
        )}
      </div>
    </button>
  );
};