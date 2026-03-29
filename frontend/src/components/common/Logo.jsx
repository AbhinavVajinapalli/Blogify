import '../../styles/Logo.scss';

/* eslint-disable react/prop-types */

const Logo = ({ text = 'Blogify', light = false, className = '' }) => {
  const classes = ['logo', light ? 'logo-light' : '', className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <span className="logo-mark" aria-hidden="true">
        B
      </span>
      <span className="logo-text">{text}</span>
    </span>
  );
};

export default Logo;
