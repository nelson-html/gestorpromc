import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800 shadow-md',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    fab: 'fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg z-50',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
