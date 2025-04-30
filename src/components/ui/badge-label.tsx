
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeLabelProps {
  text: string;
  color?: string;
  className?: string;
}

export function BadgeLabel({ text, color, className }: BadgeLabelProps) {
  return (
    <span 
      className={cn(
        "px-2 py-1 text-xs font-medium rounded-full", 
        className
      )}
      style={{ backgroundColor: color ? `${color}20` : undefined, color: color }}
    >
      {text}
    </span>
  );
}
