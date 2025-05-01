
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead, PIPELINE_STAGES, LOST_REASONS, PROPOSAL_STATUSES } from '@/types/lead';
import { BadgeLabel } from '@/components/ui/badge-label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/formatters';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { useLeadContext } from '@/context/LeadContext';

interface LeadCardProps {
  lead: Lead;
  onView: (lead: Lead) => void;
}

export function LeadCard({ lead, onView }: LeadCardProps) {
  const { moveLead, removeLead, updateLeadData } = useLeadContext();
  const stageConfig = PIPELINE_STAGES.find((s) => s.id === lead.stage) || PIPELINE_STAGES[0];
  
  const priorityColors = {
    low: '#10B981',
    medium: '#F97316',
    high: '#EF4444',
  };

  const handleMove = async (newStage: string) => {
    await moveLead(lead.id, newStage as any);
  };

  const handleDelete = async () => {
    await removeLead(lead.id);
  };

  const handleSetLostReason = async (reason: string) => {
    await updateLeadData(lead.id, {
      lostReason: reason as any
    });
  };

  const handleSetProposalStatus = async (status: string) => {
    await updateLeadData(lead.id, {
      proposalStatus: status as any
    });
  };

  // Get the lost reason label if available
  const lostReasonItem = lead.lostReason ? 
    LOST_REASONS.find(item => item.id === lead.lostReason) : 
    undefined;

  // Get the proposal status label if available
  const proposalStatusItem = lead.proposalStatus ? 
    PROPOSAL_STATUSES.find(item => item.id === lead.proposalStatus) : 
    undefined;

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-base font-medium">{lead.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{lead.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <BadgeLabel 
            text={lead.priority.toUpperCase()} 
            color={priorityColors[lead.priority]} 
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(lead)}>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete()}>Delete</DropdownMenuItem>
              
              {PIPELINE_STAGES.map((stage) => (
                lead.stage !== stage.id && (
                  <DropdownMenuItem 
                    key={stage.id} 
                    onClick={() => handleMove(stage.id)}
                  >
                    Move to {stage.name}
                  </DropdownMenuItem>
                )
              ))}

              {lead.stage === 'lost' && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Set Lost Reason</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={lead.lostReason} onValueChange={handleSetLostReason}>
                      {LOST_REASONS.map((reason) => (
                        <DropdownMenuRadioItem key={reason.id} value={reason.id}>
                          {reason.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}

              {lead.stage === 'proposal' && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Set Proposal Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={lead.proposalStatus} onValueChange={handleSetProposalStatus}>
                      {PROPOSAL_STATUSES.map((status) => (
                        <DropdownMenuRadioItem key={status.id} value={status.id}>
                          {status.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Source:</p>
            <p className="capitalize">{lead.source}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Value:</p>
            <p className="font-medium">{formatCurrency(lead.estimatedValue)}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col gap-1">
            <BadgeLabel 
              text={stageConfig.name} 
              color={stageConfig.color}
            />

            {lead.stage === 'lost' && lead.lostReason && lostReasonItem && (
              <span className="text-xs text-muted-foreground">
                Reason: {lostReasonItem.label}
              </span>
            )}

            {lead.stage === 'proposal' && lead.proposalStatus && proposalStatusItem && (
              <span className="text-xs text-muted-foreground">
                Status: {proposalStatusItem.label}
              </span>
            )}
          </div>
          
          {lead.owner ? (
            <div className="flex items-center">
              <Avatar className="w-6 h-6 mr-2">
                {lead.owner.avatar ? (
                  <AvatarImage src={lead.owner.avatar} />
                ) : (
                  <AvatarFallback>
                    {lead.owner.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="text-xs">{lead.owner.name}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Unassigned</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
