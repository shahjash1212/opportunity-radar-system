
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLeadContext } from '@/context/LeadContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PipelineChart } from '@/components/dashboard/PipelineChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Building, Briefcase, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const Dashboard = () => {
  const { leads, loading } = useLeadContext();
  
  // Calculate metrics
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const qualifiedLeads = leads.filter(lead => lead.stage === 'qualified' || lead.stage === 'proposal' || lead.stage === 'won').length;
  const wonLeads = leads.filter(lead => lead.stage === 'won').length;
  const wonValue = leads
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
        <PipelineChart leads={leads} />
      </div>
      
      <RecentActivity leads={leads} />
    </MainLayout>
  );
};

export default Dashboard;
