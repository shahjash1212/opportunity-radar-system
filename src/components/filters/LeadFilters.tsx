
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PIPELINE_STAGES, LOST_REASONS, PROPOSAL_STATUSES, User } from '@/types/lead';
import { X, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LeadFiltersProps {
  users: User[];
  onFilterChange: (filters: FilterState) => void;
  defaultOpen?: boolean;
  showDateRange?: boolean;
  showLostReason?: boolean;
  showProposalStatus?: boolean;
}

export interface FilterState {
  dateRange?: DateRange;
  assignedTo?: string;
  stage?: string;
  lostReason?: string;
  proposalStatus?: string;
}

export const LeadFilters = ({ 
  users, 
  onFilterChange, 
  defaultOpen = false,
  showDateRange = true,
  showLostReason = true,
  showProposalStatus = true
}: LeadFiltersProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [filters, setFilters] = useState<FilterState>({});

  const applyFilters = () => {
    onFilterChange(filters);
    setOpen(false);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "default" : "outline"} 
          size="sm" 
          className="h-8 gap-1"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary/20 px-1.5 text-xs font-medium">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {showDateRange && (
            <div className="grid gap-2">
              <label className="text-sm">Date Range</label>
              <DateRangePicker
                value={filters.dateRange}
                onChange={(range) => updateFilter('dateRange', range)}
                className="w-full"
              />
            </div>
          )}

          <div className="grid gap-2">
            <label className="text-sm">Assigned To</label>
            <Select
              value={filters.assignedTo}
              onValueChange={(value) => updateFilter('assignedTo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm">Pipeline Stage</label>
            <Select
              value={filters.stage}
              onValueChange={(value) => updateFilter('stage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {PIPELINE_STAGES.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showLostReason && filters.stage === 'lost' && (
            <div className="grid gap-2">
              <label className="text-sm">Lost Reason</label>
              <Select
                value={filters.lostReason}
                onValueChange={(value) => updateFilter('lostReason', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Reason</SelectItem>
                  {LOST_REASONS.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showProposalStatus && filters.stage === 'proposal' && (
            <div className="grid gap-2">
              <label className="text-sm">Proposal Status</label>
              <Select
                value={filters.proposalStatus}
                onValueChange={(value) => updateFilter('proposalStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Status</SelectItem>
                  {PROPOSAL_STATUSES.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
