
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLeadContext } from '@/context/LeadContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PipelineChart } from '@/components/dashboard/PipelineChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Building, Briefcase, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { FilterState, LeadFilters } from '@/components/filters/LeadFilters';
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';

const Dashboard = () => {
  const { leads, loading, users } = useLeadContext();
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
  
  // Calculate metrics based on filtered leads
  const totalLeads = filteredLeads.length;
  const totalValue = filteredLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const qualifiedLeads = filteredLeads.filter(lead => lead.stage === 'qualified' || lead.stage === 'proposal' || lead.stage === 'won').length;
  const wonLeads = filteredLeads.filter(lead => lead.stage === 'won').length;
  const wonValue = filteredLeads
    .filter(lead => lead.stage === 'won')
    .reduce((sum, lead) => sum + lead.estimatedValue, 0);
  
  // Calculate pipeline conversion metrics
  const conversionRate = totalLeads ? Math.round((wonLeads / totalLeads) * 100) : 0;
  
  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard">
      <div className="flex justify-end mb-4">
        <LeadFilters 
          users={users} 
          onFilterChange={setFilters} 
          showLostReason={false}
          showProposalStatus={false}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="Total Leads" 
          value={totalLeads} 
          icon={<Building className="h-4 w-4" />}
        />
        
        <MetricCard 
          title="Pipeline Value" 
          value={formatCurrency(totalValue)} 
          icon={<Briefcase className="h-4 w-4" />}
        />
        
        <MetricCard 
          title="Qualified Leads" 
          value={qualifiedLeads} 
          icon={<Users className="h-4 w-4" />}
        />
        
        <MetricCard 
          title="Won Value" 
          value={formatCurrency(wonValue)} 
          icon={<Briefcase className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <PipelineChart leads={filteredLeads} />
      </div>
      
      <RecentActivity leads={filteredLeads} />
    </MainLayout>
  );
};

export default Dashboard;
