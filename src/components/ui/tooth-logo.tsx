import React from 'react';

interface ToothLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'outline' | 'minimal';
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

export function ToothLogo({ 
  className = '', 
  size = 'md', 
  showText = true,
  variant = 'default'
}: ToothLogoProps) {
  const toothSizeClass = sizeClasses[size];
  
  const ToothIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${toothSizeClass} ${className}`}
    >
      {variant === 'outline' ? (
        <path
          d="M12 2C8.5 2 6 4.5 6 8C6 10 6.5 11.5 7 13C7.5 14.5 8 16 8 18C8 20 9 22 12 22C15 22 16 20 16 18C16 16 16.5 14.5 17 13C17.5 11.5 18 10 18 8C18 4.5 15.5 2 12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : variant === 'minimal' ? (
        <path
          d="M12 2C8.5 2 6 4.5 6 8C6 12 8 16 8 18C8 20 10 22 12 22C14 22 16 20 16 18C16 16 18 12 18 8C18 4.5 15.5 2 12 2Z"
          fill="currentColor"
        />
      ) : (
        <>
          <path
            d="M12 2C8.5 2 6 4.5 6 8C6 10 6.5 11.5 7 13C7.5 14.5 8 16 8 18C8 20 9 22 12 22C15 22 16 20 16 18C16 16 16.5 14.5 17 13C17.5 11.5 18 10 18 8C18 4.5 15.5 2 12 2Z"
            fill="currentColor"
          />
          <path
            d="M12 4C10 4 8.5 5.5 8.5 7.5C8.5 9 9 10 9.5 11C10 12 10.5 13 10.5 14.5C10.5 15.5 11 16.5 12 16.5C13 16.5 13.5 15.5 13.5 14.5C13.5 13 14 12 14.5 11C15 10 15.5 9 15.5 7.5C15.5 5.5 14 4 12 4Z"
            fill="white"
            fillOpacity="0.3"
          />
        </>
      )}
    </svg>
  );

  if (!showText) {
    return <ToothIcon />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ToothIcon />
      <span className={`font-bold ${
        size === 'sm' ? 'text-lg' : 
        size === 'md' ? 'text-xl' : 
        size === 'lg' ? 'text-2xl' : 
        'text-3xl'
      }`}>
        Cognident
      </span>
    </div>
  );
}

export function ToothIcon({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return <ToothLogo className={className} size={size} showText={false} />;
}

// Specific logo variants for different use cases
export function HeaderLogo({ className = '' }: { className?: string }) {
  return <ToothLogo className={className} size="md" showText={true} variant="default" />;
}

export function LargeLogo({ className = '' }: { className?: string }) {
  return <ToothLogo className={className} size="xl" showText={true} variant="default" />;
}

export function CompactLogo({ className = '' }: { className?: string }) {
  return <ToothLogo className={className} size="sm" showText={true} variant="minimal" />;
}

export function IconOnly({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return <ToothLogo className={className} size={size} showText={false} variant="default" />;
}
