
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLeadContext } from '@/context/LeadContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { PIPELINE_STAGES } from '@/types/lead';
import { FilterState, LeadFilters } from '@/components/filters/LeadFilters';
import { isWithinInterval } from 'date-fns';

const COLORS = ['#9b87f5', '#0EA5E9', '#F97316', '#10B981', '#EF4444'];

const Reports = () => {
  const { leads, users } = useLeadContext();
  const [filters, setFilters] = useState<FilterState>({});

  // Apply filters
  const filteredLeads = leads.filter(lead => {
    // Date range filter
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const date = new Date(lead.createdAt);
      if (!isWithinInterval(date, { 
        start: new Date(filters.dateRange.from), 
        end: new Date(filters.dateRange.to) 
      })) {
        return false;
      }
    }

    // Owner filter
    if (filters.assignedTo) {
      if (filters.assignedTo === 'unassigned') {
        if (lead.owner) return false;
      } else if (!lead.owner || lead.owner.id !== filters.assignedTo) {
        return false;
      }
    }

    // Stage filter
    if (filters.stage && filters.stage !== 'all' && lead.stage !== filters.stage) {
      return false;
    }

    // Lost reason filter
    if (filters.lostReason && filters.lostReason !== 'all' && lead.stage === 'lost') {
      if (lead.lostReason !== filters.lostReason) return false;
    }

    // Proposal status filter
    if (filters.proposalStatus && filters.proposalStatus !== 'all' && lead.stage === 'proposal') {
      if (lead.proposalStatus !== filters.proposalStatus) return false;
    }

    return true;
  });

  // Pipeline by stage data
  const stageData = PIPELINE_STAGES.map(stage => {
    const stageLeads = filteredLeads.filter(lead => lead.stage === stage.id);
    return {
      name: stage.name,
      value: stageLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0),
      count: stageLeads.length,
      color: stage.color,
    };
  });

  // Source distribution data
  const sourceData = Array.from(
    filteredLeads.reduce((acc, lead) => {
      const source = lead.source;
      if (!acc.has(source)) {
        acc.set(source, { name: source, count: 0, value: 0 });
      }
      
      const current = acc.get(source)!;
      current.count += 1;
      current.value += lead.estimatedValue;
      
      return acc;
    }, new Map())
  ).map(([_, data]) => data);

  // Priority distribution
  const priorityData = Array.from(
    filteredLeads.reduce((acc, lead) => {
      const priority = lead.priority;
      if (!acc.has(priority)) {
        acc.set(priority, { name: priority, count: 0, value: 0 });
      }
      
      const current = acc.get(priority)!;
      current.count += 1;
      current.value += lead.estimatedValue;
      
      return acc;
    }, new Map())
  ).map(([_, data]) => data);

  // Lost reasons data
  const lostReasonData = Array.from(
    filteredLeads.filter(lead => lead.stage === 'lost').reduce((acc, lead) => {
      const reason = lead.lostReason || 'other';
      if (!acc.has(reason)) {
        acc.set(reason, { name: reason, count: 0, value: 0 });
      }
      
      const current = acc.get(reason)!;
      current.count += 1;
      current.value += lead.estimatedValue;
      
      return acc;
    }, new Map())
  ).map(([id, data]) => {
    const reasonLabel = PIPELINE_STAGES.find(reason => reason.id === id)?.name || id;
    return {
      ...data,
      name: reasonLabel.charAt(0).toUpperCase() + reasonLabel.slice(1).replace('-', ' ')
    };
  });

  return (
    <MainLayout title="Reports">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pipeline Analytics</h2>
        <LeadFilters users={users} onFilterChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pipeline Value by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#888' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)} 
                    tick={{ fill: '#888' }}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="value" name="Value">
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lead Count by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Leads']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Value by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#888' }} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="value" name="Value" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lead Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stageData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Leads']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredLeads.filter(lead => lead.stage === 'lost').length > 0 && (
        <div className="mt-6">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Lost Reasons Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={lostReasonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="value" name="Value" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

export default Reports;
