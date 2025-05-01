
import React from 'react';
import { Lead, PIPELINE_STAGES } from '@/types/lead';
import { LeadCard } from './LeadCard';
import { BadgeLabel } from '../ui/badge-label';

interface LeadsListViewProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  filteredStage?: string;
}

export const LeadsListView = ({ leads, onViewLead, filteredStage }: LeadsListViewProps) => {
  const filteredLeads = filteredStage && filteredStage !== 'all' 
    ? leads.filter(lead => lead.stage === filteredStage)
    : leads;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredLeads.length === 0 ? (
        <p className="col-span-full text-center py-8 text-muted-foreground">
          No leads found in this stage.
        </p>
      ) : (
        filteredLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onView={onViewLead} />
        ))
      )}
    </div>
  );
};
