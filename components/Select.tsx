import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, name, options, placeholder, ...props }) => {
  // Updated chevron icon color to match brand-beige (#F1EEE9)
  const chevronIcon = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23F1EEE9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-brand-beige/80">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          className={`w-full px-1 py-2 bg-transparent border-0 border-b border-brand-beige/20 rounded-none focus:outline-none focus:ring-0 focus:border-brand-orange transition-colors duration-300 appearance-none text-lg ${props.value ? 'text-brand-beige' : 'text-brand-beige/30'}`}
          style={{
            backgroundImage: chevronIcon,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-500">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-brand-dark text-brand-beige">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;