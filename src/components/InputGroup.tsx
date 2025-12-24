import React from 'react';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isOptional?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, isOptional, className, ...props }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        {label} 
        {isOptional && <span className="text-gray-400 font-normal text-xs ml-1">*Optional</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6A8D26] focus:border-transparent transition-shadow bg-white"
        />
      </div>
    </div>
  );
};