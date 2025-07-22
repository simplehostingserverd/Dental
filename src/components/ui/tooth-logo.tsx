import React from 'react';
import Image from 'next/image';

interface ToothLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'outline' | 'minimal';
}

const sizeClasses = {
  sm: 'h-8 w-8',     // 30% larger than h-6 w-6
  md: 'h-10 w-10',   // 30% larger than h-8 w-8
  lg: 'h-16 w-16',   // 30% larger than h-12 w-12
  xl: 'h-20 w-20'    // 30% larger than h-16 w-16
};

export function ToothLogo({
  className = '',
  size = 'md',
  showText = true,
  variant = 'default'
}: ToothLogoProps) {
  const toothSizeClass = sizeClasses[size];

  const ToothIcon = () => (
    <Image
      src="/Logos/tooth3.png"
      alt="Tooth Logo"
      width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 64 : 80}
      height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 64 : 80}
      className={`${toothSizeClass} ${className} object-contain`}
      priority
    />
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
