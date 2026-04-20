import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'blogify-theme';
const EFFECTS_STORAGE_KEY = 'blogify-effects';
const ThemeContext = createContext(null);

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const getInitialEffects = () => {
  const savedEffects = localStorage.getItem(EFFECTS_STORAGE_KEY);
  return savedEffects === 'on';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [effectsEnabled, setEffectsEnabled] = useState(getInitialEffects);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-effects', effectsEnabled ? 'on' : 'off');
    localStorage.setItem(EFFECTS_STORAGE_KEY, effectsEnabled ? 'on' : 'off');
  }, [effectsEnabled]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleEffects = () => {
    setEffectsEnabled((currentValue) => !currentValue);
  };

  const value = useMemo(
    () => ({
      theme,
      isDarkTheme: theme === 'dark',
      effectsEnabled,
      toggleTheme,
      toggleEffects,
      setEffectsEnabled,
      setTheme,
    }),
    [effectsEnabled, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
