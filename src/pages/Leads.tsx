
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLeadContext } from '@/context/LeadContext';
import { Lead, PIPELINE_STAGES } from '@/types/lead';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateLeadDialog } from '@/components/leads/CreateLeadDialog';
import { LeadCard } from '@/components/leads/LeadCard';
import { ViewLeadDialog } from '@/components/leads/ViewLeadDialog';

const Leads = () => {
  const { leads, loading } = useLeadContext();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewDialogOpen(true);
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
        <CreateLeadDialog />
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.length === 0 ? (
              <p className="col-span-full text-center py-8 text-muted-foreground">
                No leads found. Add your first lead to get started!
              </p>
            ) : (
              leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onView={handleViewLead} />
              ))
            )}
          </div>
        </TabsContent>

        {PIPELINE_STAGES.map((stage) => (
          <TabsContent key={stage.id} value={stage.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leads.filter((lead) => lead.stage === stage.id).length === 0 ? (
                <p className="col-span-full text-center py-8 text-muted-foreground">
                  No leads in this stage.
                </p>
              ) : (
                leads
                  .filter((lead) => lead.stage === stage.id)
                  .map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onView={handleViewLead} />
                  ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ViewLeadDialog
        lead={selectedLead}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </MainLayout>
  );
};

export default Leads;
