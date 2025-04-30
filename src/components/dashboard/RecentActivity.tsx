
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead } from '@/types/lead';
import { formatDateTime } from '@/lib/formatters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecentActivityProps {
  leads: Lead[];
}

export function RecentActivity({ leads }: RecentActivityProps) {
  // Sort leads by updatedAt date in descending order
  const sortedLeads = [...leads]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedLeads.map((lead) => (
            <div key={lead.id} className="flex items-start space-x-4">
              {lead.owner ? (
                <Avatar>
                  {lead.owner.avatar ? (
                    <AvatarImage src={lead.owner.avatar} alt={lead.owner.name} />
                  ) : (
                    <AvatarFallback>
                      {lead.owner.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium">{lead.name} ({lead.company})</p>
                <p className="text-xs text-muted-foreground">
                  {lead.owner ? `Updated by ${lead.owner.name}` : 'Updated'} • {formatDateTime(lead.updatedAt)}
                </p>
              </div>
            </div>
          ))}

          {sortedLeads.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
