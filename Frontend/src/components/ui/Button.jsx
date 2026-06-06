import React from 'react';

const Button = ({ variant = 'primary', size = 'medium', disabled, className = '', children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium rounded-md transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-orange-600 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    destructive: "bg-error text-white hover:bg-red-600 shadow-sm"
  };
  
  const sizes = {
    small: "h-7 px-3 text-[12px]",
    medium: "h-9 px-4 text-[14px]",
    large: "h-11 px-5 text-[15px]"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
