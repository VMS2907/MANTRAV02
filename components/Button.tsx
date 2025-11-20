import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-6 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 text-sm backdrop-blur-md";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-white/10 hover:border-white/20",
    secondary: "bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-sm",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
    danger: "bg-gradient-to-r from-red-500/10 to-red-900/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${loading ? 'opacity-70 cursor-wait' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
          <span>Thinking...</span>
        </>
      ) : children}
      
      {/* Subtle Shine Effect for Primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] hover:animate-[shimmer_1.5s_infinite]" />
      )}
    </button>
  );
};