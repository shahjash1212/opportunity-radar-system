
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLeadContext } from '@/context/LeadContext';
import { Lead, PIPELINE_STAGES, PipelineStage } from '@/types/lead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateLeadDialog } from '@/components/leads/CreateLeadDialog';
import { LeadCard } from '@/components/leads/LeadCard';
import { ViewLeadDialog } from '@/components/leads/ViewLeadDialog';
import { Button } from '@/components/ui/button';
import { Kanban, List } from 'lucide-react';
import { LeadsKanbanBoard } from '@/components/leads/LeadsKanbanBoard';
import { LeadsListView } from '@/components/leads/LeadsListView';
import { toast } from '@/components/ui/sonner';

const Leads = () => {
  const { leads, loading, moveLead } = useLeadContext();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewDialogOpen(true);
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move to different stage
    if (destination.droppableId !== source.droppableId) {
      const leadId = draggableId;
      const newStage = destination.droppableId as PipelineStage;
      
      moveLead(leadId, newStage)
        .then(() => {
          toast.success(`Lead moved to ${PIPELINE_STAGES.find(stage => stage.id === newStage)?.name}`);
        })
        .catch((error) => {
          console.error('Error moving lead:', error);
          toast.error('Failed to move lead');
        });
    }
  };

  if (loading) {
    return (
      <MainLayout title="Leads">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading leads...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Leads Management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Leads</h2>
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 rounded-md p-1 flex">
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              className={`${viewMode === 'board' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setViewMode('board')}
            >
              <Kanban className="h-4 w-4 mr-1" />
              Board
            </Button>
          </div>
          <CreateLeadDialog />
        </div>
      </div>

      {viewMode === 'board' ? (
        <div className="mt-6">
          <LeadsKanbanBoard 
            leads={leads} 
            onViewLead={handleViewLead} 
            onDragEnd={handleDragEnd} 
          />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Leads</TabsTrigger>
            {PIPELINE_STAGES.map((stage) => (
              <TabsTrigger key={stage.id} value={stage.id}>
                {stage.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <LeadsListView leads={leads} onViewLead={handleViewLead} />
          </TabsContent>

          {PIPELINE_STAGES.map((stage) => (
            <TabsContent key={stage.id} value={stage.id} className="mt-6">
              <LeadsListView 
                leads={leads}
                onViewLead={handleViewLead}
                filteredStage={stage.id}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      <ViewLeadDialog
        lead={selectedLead}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </MainLayout>
  );
};

export default Leads;
