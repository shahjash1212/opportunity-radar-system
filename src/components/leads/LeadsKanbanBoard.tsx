
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Lead, LOST_REASONS, PROPOSAL_STATUSES } from '@/types/lead';
import { LeadCard } from './LeadCard';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useLeadContext } from '@/context/LeadContext';

interface LeadsKanbanBoardProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onDragEnd: (result: any) => void;
}

export const LeadsKanbanBoard = ({ leads, onViewLead, onDragEnd }: LeadsKanbanBoardProps) => {
  const { pipelineStages } = useLeadContext();
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
        {pipelineStages.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.stage === stage.id);
          
          // Group lost leads by reason if in the lost stage
          const groupedLeads = stage.id === 'lost' 
            ? stageLeads.reduce((acc, lead) => {
                const reason = lead.lostReason || 'other';
                if (!acc[reason]) acc[reason] = [];
                acc[reason].push(lead);
                return acc;
              }, {} as Record<string, Lead[]>)
            : {};
          
          // Group proposal leads by status if in the proposal stage
          const proposalGroupedLeads = stage.id === 'proposal'
            ? stageLeads.reduce((acc, lead) => {
                const status = lead.proposalStatus || 'other';
                if (!acc[status]) acc[status] = [];
                acc[status].push(lead);
                return acc;
              }, {} as Record<string, Lead[]>)
            : {};
            
          return (
            <div 
              key={stage.id} 
              className="min-w-[300px] w-[300px] flex-shrink-0"
            >
              <div 
                className="bg-slate-50 rounded-md p-3 border-t-4"
                style={{ borderTopColor: stage.color }}
              >
                <div className="flex items-center mb-3 justify-between">
                  <h3 className="font-medium">{stage.name}</h3>
                  <span className="text-xs bg-slate-200 px-2.5 py-1 rounded-full font-medium">
                    {stageLeads.length}
                  </span>
                </div>
                
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "min-h-[300px]", 
                        snapshot.isDraggingOver ? "bg-slate-100" : ""
                      )}
                    >
                      {stage.id === 'lost' ? (
                        // Render lost leads grouped by reason
                        Object.entries(groupedLeads).length > 0 ? (
                          Object.entries(groupedLeads).map(([reason, reasonLeads]) => {
                            const reasonObj = LOST_REASONS.find(r => r.id === reason);
                            return (
                              <div key={reason} className="mb-6">
                                <div className="flex items-center mb-2 bg-red-50 p-2 rounded-md border-l-4 border-red-400">
                                  <Badge variant="outline" className="text-xs bg-white">
                                    {reasonObj?.label || 'Other'}
                                  </Badge>
                                  <span className="ml-2 text-xs text-red-700">
                                    {reasonLeads.length} {reasonLeads.length === 1 ? 'lead' : 'leads'}
                                  </span>
                                </div>
                                {reasonLeads.map((lead, index) => (
                                  <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn("mb-3", snapshot.isDragging ? "opacity-70" : "")}
                                      >
                                        <LeadCard lead={lead} onView={onViewLead} />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                            No lost leads
                          </div>
                        )
                      ) : stage.id === 'proposal' ? (
                        // Render proposal leads grouped by status
                        Object.entries(proposalGroupedLeads).length > 0 ? (
                          Object.entries(proposalGroupedLeads).map(([status, statusLeads]) => {
                            const statusObj = PROPOSAL_STATUSES.find(s => s.id === status);
                            return (
                              <div key={status} className="mb-6">
                                <div className="flex items-center mb-2 bg-orange-50 p-2 rounded-md border-l-4 border-orange-400">
                                  <Badge variant="outline" className="text-xs bg-white">
                                    {statusObj?.label || 'Other'}
                                  </Badge>
                                  <span className="ml-2 text-xs text-orange-700">
                                    {statusLeads.length} {statusLeads.length === 1 ? 'lead' : 'leads'}
                                  </span>
                                </div>
                                {statusLeads.map((lead, index) => (
                                  <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn("mb-3", snapshot.isDragging ? "opacity-70" : "")}
                                      >
                                        <LeadCard lead={lead} onView={onViewLead} />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                            No proposals
                          </div>
                        )
                      ) : (
                        // Render regular leads without grouping
                        stageLeads.length > 0 ? (
                          stageLeads.map((lead, index) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn("mb-3", snapshot.isDragging ? "opacity-70" : "")}
                                >
                                  <LeadCard lead={lead} onView={onViewLead} />
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                            No leads in this stage
                          </div>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
