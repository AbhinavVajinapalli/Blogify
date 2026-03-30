import '../../styles/Logo.scss';

/* eslint-disable react/prop-types */

const Logo = ({ text = 'Blogify', light = false, className = '' }) => {
  const classes = ['logo', light ? 'logo-light' : '', className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 5.5H16C17.38 5.5 18.5 6.62 18.5 8V18.5L14.5 16L10.5 18.5V8C10.5 6.62 9.38 5.5 8 5.5H6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M6 5.5H8C9.38 5.5 10.5 6.62 10.5 8V18.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      <span className="logo-text">{text}</span>
    </span>
  );
};

export default Logo;
