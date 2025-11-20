import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, name, ...props }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-brand-beige/80">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full px-1 py-2 bg-transparent border-0 border-b border-brand-beige/20 rounded-none focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors duration-300 placeholder-brand-beige/30 text-lg text-brand-beige"
        {...props}
      />
    </div>
  );
};

export default Input;