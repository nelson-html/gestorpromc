import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Input = ({ label, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>}
      <input
        className={twMerge(
          'w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-400',
          className
        )}
        {...props}
      />
    </div>
  );
};

export const Select = ({ label, options, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>}
      <select
        className={twMerge(
          'w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all bg-white',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};
