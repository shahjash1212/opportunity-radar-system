
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Lead, PIPELINE_STAGES, StageConfig } from '@/types/lead';
import { LeadCard } from './LeadCard';
import { cn } from '@/lib/utils';

interface LeadsKanbanBoardProps {
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onDragEnd: (result: any) => void;
}

export const LeadsKanbanBoard = ({ leads, onViewLead, onDragEnd }: LeadsKanbanBoardProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
        {PIPELINE_STAGES.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.stage === stage.id);
          
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
                      {stageLeads.map((lead, index) => (
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
