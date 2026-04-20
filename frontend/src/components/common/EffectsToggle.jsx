import { useTheme } from '../../context/ThemeContext';

const EffectsToggle = ({ className = '' }) => {
  const { effectsEnabled, toggleEffects } = useTheme();
  const combinedClassName = `effects-toggle ${className}`.trim();

  return (
    <button
      type="button"
      className={combinedClassName}
      onClick={toggleEffects}
      aria-label={`${effectsEnabled ? 'Disable' : 'Enable'} background effects`}
      title={`${effectsEnabled ? 'Disable' : 'Enable'} background effects`}
    >
      <span className="effects-toggle-icon" aria-hidden="true">
        FX
      </span>
      <span className="effects-toggle-text">{effectsEnabled ? 'Effects on' : 'Effects off'}</span>
    </button>
  );
};

export default EffectsToggle;
