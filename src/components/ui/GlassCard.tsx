import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'purple' | 'cyan' | 'orange' | 'none';
  hover?: boolean;
  onClick?: () => void;
}

const glowStyles = {
  purple: 'hover:shadow-glow hover:border-phoenix-purple-500/40',
  cyan: 'hover:shadow-glow-cyan hover:border-phoenix-cyan-500/40',
  orange: 'hover:shadow-glow-orange hover:border-phoenix-orange-500/40',
  none: '',
};

export function GlassCard({ children, className = '', glow = 'none', hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-xl
        ${hover ? 'transition-all duration-300 cursor-pointer' : ''}
        ${glow !== 'none' ? glowStyles[glow] : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
