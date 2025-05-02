
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { StageConfig, PIPELINE_STAGES } from '@/types/lead';
import { X, Edit, Check, Plus } from 'lucide-react';
import { useLeadContext } from '@/context/LeadContext';

export function PipelineSettings() {
  const { updatePipelineStages } = useLeadContext();
  const [customStages, setCustomStages] = useState<StageConfig[]>(PIPELINE_STAGES.map(stage => ({ ...stage })));
  const [newStage, setNewStage] = useState<Partial<StageConfig>>({ id: '', name: '', color: '#64748B' });
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  const handleSave = () => {
    // Validate stage IDs are unique
    const stageIds = customStages.map(stage => stage.id);
    if (new Set(stageIds).size !== stageIds.length) {
      toast.error("Stage IDs must be unique");
      return;
    }

    updatePipelineStages(customStages);
    toast.success("Pipeline settings updated");
  };

  const handleAddStage = () => {
    if (!newStage.id || !newStage.name) {
      toast.error("Please enter both ID and name for the new stage");
      return;
    }

    // Check if ID already exists
    if (customStages.some(stage => stage.id === newStage.id)) {
      toast.error("Stage ID must be unique");
      return;
    }

    setCustomStages([...customStages, { 
      id: newStage.id, 
      name: newStage.name, 
      color: newStage.color || '#64748B' 
    }]);
    setNewStage({ id: '', name: '', color: '#64748B' });
    toast.success("Stage added");
  };

  const handleRemoveStage = (id: string) => {
    // Don't allow removing if there are less than 2 stages
    if (customStages.length <= 2) {
      toast.error("You must have at least 2 pipeline stages");
      return;
    }

    setCustomStages(customStages.filter(stage => stage.id !== id));
    toast.success("Stage removed");
  };

  const handleEditStage = (id: string) => {
    setEditingStageId(id);
  };

  const handleUpdateStage = (index: number, field: keyof StageConfig, value: string) => {
    const updatedStages = [...customStages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    setCustomStages(updatedStages);
  };

  const handleSaveEdit = () => {
    setEditingStageId(null);
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === customStages.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedStages = [...customStages];
    [updatedStages[index], updatedStages[newIndex]] = [updatedStages[newIndex], updatedStages[index]];
    setCustomStages(updatedStages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Stage Configuration</CardTitle>
        <CardDescription>
          Configure your lead pipeline stages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <h3 className="text-sm font-medium mb-4">Current Pipeline Stages</h3>
            <div className="space-y-2">
              {customStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  {editingStageId === stage.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="flex-shrink-0">
                        <Input 
                          type="color" 
                          value={stage.color}
                          onChange={(e) => handleUpdateStage(index, 'color', e.target.value)}
                          className="w-10 h-8"
                        />
                      </div>
                      <div className="flex-1">
                        <Input 
                          value={stage.name}
                          onChange={(e) => handleUpdateStage(index, 'name', e.target.value)}
                          placeholder="Stage name"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSaveEdit}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 flex-1">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-medium flex-1">{stage.name}</span>
                      <div className="flex items-center space-x-1">
                        {index > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMoveStage(index, 'up')}
                          >
                            <span className="sr-only">Move up</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                          </Button>
                        )}
                        {index < customStages.length - 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMoveStage(index, 'down')}
                          >
                            <span className="sr-only">Move down</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditStage(stage.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveStage(stage.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add New Stage</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="new-stage-id">ID</Label>
                <Input 
                  id="new-stage-id" 
                  placeholder="e.g. discovery"
                  value={newStage.id}
                  onChange={e => setNewStage({...newStage, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                />
                <p className="text-xs text-muted-foreground mt-1">Unique identifier (no spaces)</p>
              </div>
              <div>
                <Label htmlFor="new-stage-name">Name</Label>
                <Input 
                  id="new-stage-name"
                  placeholder="e.g. Discovery" 
                  value={newStage.name}
                  onChange={e => setNewStage({...newStage, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="new-stage-color">Color</Label>
                <Input 
                  id="new-stage-color"
                  type="color"
                  value={newStage.color}
                  onChange={e => setNewStage({...newStage, color: e.target.value})}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddStage}>
                  <Plus className="h-4 w-4 mr-1" /> 
                  Add Stage
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
