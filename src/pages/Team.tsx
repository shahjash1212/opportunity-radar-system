
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLeadContext } from '@/context/LeadContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/formatters';

const Team = () => {
  const { users, leads } = useLeadContext();

  // Calculate user stats
  const userStats = users.map(user => {
    const userLeads = leads.filter(lead => lead.owner?.id === user.id);
    const totalLeads = userLeads.length;
    const totalValue = userLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
    const wonLeads = userLeads.filter(lead => lead.stage === 'won').length;
    const wonValue = userLeads
      .filter(lead => lead.stage === 'won')
      .reduce((sum, lead) => sum + lead.estimatedValue, 0);

    return {
      ...user,
      totalLeads,
      totalValue,
      wonLeads,
      wonValue,
    };
  });

  return (
    <MainLayout title="Team Management">
      <h2 className="text-2xl font-bold mb-6">Team Members</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userStats.map(user => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Avatar className="h-10 w-10 mr-4">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-base">{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Assigned Leads</p>
                  <p className="text-lg font-semibold">{user.totalLeads}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Won Leads</p>
                  <p className="text-lg font-semibold">{user.wonLeads}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pipeline Value</p>
                  <p className="text-lg font-semibold">{formatCurrency(user.totalValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Closed Value</p>
                  <p className="text-lg font-semibold">{formatCurrency(user.wonValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default Team;
