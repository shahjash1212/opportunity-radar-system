
import React from 'react';
import { Lead, PIPELINE_STAGES } from '@/types/lead';
import { LeadCard } from './LeadCard';
import { BadgeLabel } from '../ui/badge-label';
import { FilterState, LeadFilters } from '../filters/LeadFilters';
import { isWithinInterval } from 'date-fns';

interface LeadsListViewProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  filteredStage?: string;
  users: any[];
}

export const LeadsListView = ({ leads, onViewLead, filteredStage, users }: LeadsListViewProps) => {
  const [filters, setFilters] = React.useState<FilterState>({});
  
  // First filter by stage if specified
  let stageFilteredLeads = filteredStage && filteredStage !== 'all' 
    ? leads.filter(lead => lead.stage === filteredStage)
    : leads;
  
  // Then apply additional filters
  const filteredLeads = stageFilteredLeads.filter(lead => {
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
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <LeadFilters 
          users={users} 
          onFilterChange={setFilters}
          showLostReason={filteredStage === 'lost'} 
          showProposalStatus={filteredStage === 'proposal'} 
        />
      </div>

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
    </div>
  );
};
