import '../../styles/Logo.scss';

/* eslint-disable react/prop-types */

const Logo = ({ text = 'Blogify', light = false, iconOnly = false, className = '' }) => {
  const classes = ['logo', light ? 'logo-light' : '', iconOnly ? 'logo-icon-only' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.5 14.3 7.1l5 .7-3.6 3.5.9 5-4.6-2.4-4.6 2.4.9-5-3.6-3.5 5-.7L12 2.5Z" fill="currentColor" opacity="0.15" />
          <path
            d="M6.5 5h6.8c2.32 0 4.2 1.88 4.2 4.2v9.3l-4.2-2.5-4.2 2.5V9.2A4.2 4.2 0 0 0 4.9 5h1.6Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9.1 8.5h4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M9.1 11.8h4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </span>
      {text ? <span className="logo-text">{text}</span> : null}
    </span>
  );
};

export default Logo;
