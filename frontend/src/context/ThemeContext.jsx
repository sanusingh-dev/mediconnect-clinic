import { createContext, useEffect, useState } from 'react';

const defaultTheme = 'light';
export const ThemeContext = createContext({ theme: defaultTheme, toggleTheme: () => {} });

const getInitialTheme = () => {
  try {
    if (typeof window === 'undefined') return defaultTheme;
    const stored = window.localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : defaultTheme;
  } catch (error) {
    console.warn('Unable to read theme from localStorage:', error);
    return defaultTheme;
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Unable to persist theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
