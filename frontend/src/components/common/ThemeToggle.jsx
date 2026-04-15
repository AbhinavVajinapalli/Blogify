import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const combinedClassName = `theme-toggle ${className}`.trim();

  return (
    <button
      type="button"
      className={combinedClassName}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDarkTheme ? 'L' : 'D'}
      </span>
      <span className="theme-toggle-text">{isDarkTheme ? 'Light' : 'Dark'} mode</span>
    </button>
  );
};

export default ThemeToggle;
