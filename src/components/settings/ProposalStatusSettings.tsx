
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { PROPOSAL_STATUSES } from '@/types/lead';
import { X } from 'lucide-react';

export function ProposalStatusSettings() {
  const [customProposalStatuses, setCustomProposalStatuses] = useState(PROPOSAL_STATUSES.map(status => ({ ...status })));
  const [newProposalStatus, setNewProposalStatus] = useState({ id: '', label: '' });

  const handleSave = () => {
    toast.success("Proposal Statuses settings updated");
  };

  const handleAddProposalStatus = () => {
    if (!newProposalStatus.id || !newProposalStatus.label) {
      toast.error("Please enter both ID and label for the new proposal status");
      return;
    }

    setCustomProposalStatuses([...customProposalStatuses, { ...newProposalStatus }]);
    setNewProposalStatus({ id: '', label: '' });
    toast.success("Proposal status added");
  };

  const handleRemoveProposalStatus = (id: string) => {
    setCustomProposalStatuses(customProposalStatuses.filter(status => status.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposal Status Configuration</CardTitle>
        <CardDescription>
          Configure statuses for proposals in progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <h3 className="text-sm font-medium mb-4">Current Proposal Statuses</h3>
            <div className="space-y-2">
              {customProposalStatuses.map((status, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium">{status.label}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveProposalStatus(status.id)}
                    disabled={index < 6} // Prevent removing default statuses
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add New Proposal Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-status-id">ID</Label>
                <Input 
                  id="new-status-id" 
                  placeholder="e.g. contract-review"
                  value={newProposalStatus.id}
                  onChange={e => setNewProposalStatus({...newProposalStatus, id: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="new-status-label">Label</Label>
                <Input 
                  id="new-status-label"
                  placeholder="e.g. Contract Review" 
                  value={newProposalStatus.label}
                  onChange={e => setNewProposalStatus({...newProposalStatus, label: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleAddProposalStatus}>Add Proposal Status</Button>
          </div>

          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
