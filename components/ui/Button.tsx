import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button = ({
  children,
  variant = 'primary',
  isLoading,
  leftIcon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "premium-gradient text-white hover:opacity-90 active:scale-[0.98]",
    secondary: "bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-[0.98]",
    danger: "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]",
  };

  return (
    <button
      className={cn(
        "relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100",
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {leftIcon}
          {children}
        </>
      )}
    </button>
  );
};
