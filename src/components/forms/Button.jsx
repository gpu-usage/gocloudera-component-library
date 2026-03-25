import React from 'react';
import clsx from 'clsx';
import * as Icons from 'lucide-react';

/**
 * Button Component
 */
const Button = ({
  text,
  url,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  openInNewTab = false,
  scrollTarget,
  onClick,
  disabled = false,
  style = {},
  className = '',
}) => {
  const IconComponent = icon && Icons[icon];

  const sizeStyles = {
    small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    large: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: '#fff',
      color: '#4f46e5',
      border: '2px solid #4f46e5',
    },
    outline: {
      background: 'transparent',
      color: '#fff',
      border: '2px solid #fff',
    },
    ghost: {
      background: 'transparent',
      color: '#4f46e5',
      border: 'none',
    },
    danger: {
      background: '#ef4444',
      color: '#fff',
      border: 'none',
    },
    success: {
      background: '#22c55e',
      color: '#fff',
      border: 'none',
    },
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s',
    textDecoration: 'none',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  const handleClick = (e) => {
    if (type === 'scroll' && scrollTarget) {
      e.preventDefault();
      const element = document.querySelector(scrollTarget);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClick?.(e);
  };

  const content = (
    <>
      {IconComponent && iconPosition === 'left' && <IconComponent size={18} />}
      <span>{text}</span>
      {IconComponent && iconPosition === 'right' && <IconComponent size={18} />}
    </>
  );

  if (url && type === 'link') {
    return (
      <a
        href={url}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={clsx('button', `button-${variant}`, className)}
        style={buttonStyle}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={clsx('button', `button-${variant}`, className)}
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;

