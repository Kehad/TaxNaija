import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[#5D8010] hover:bg-[#4a660d] text-white shadow-lg shadow-[#6A8D26]/20",
    outline: "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-gray-900 px-0 py-0",
    // Special active state for the toggle buttons
    activeOutline: "bg-[#EBF3D6] border-[#6A8D26] text-black" 
  };

  // We handle the "active" logic in the parent, but we can pass 'outline' or 'activeOutline' via className or a custom prop if needed. 
  // For simplicity here, I'll rely on className overrides for specific toggle states in the parent.

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};