
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { User } from '@/types/lead';

interface AvatarGroupProps {
  users: User[];
  max?: number;
}

export function AvatarGroup({ users, max = 3 }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleUsers.map((user) => (
        <Avatar key={user.id} className="border-2 border-background w-8 h-8">
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.name} />
          ) : (
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          )}
        </Avatar>
      ))}
      
      {remaining > 0 && (
        <Avatar className="border-2 border-background w-8 h-8">
          <AvatarFallback className="bg-muted">
            +{remaining}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
