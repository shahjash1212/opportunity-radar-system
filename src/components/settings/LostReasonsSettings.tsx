
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { LOST_REASONS } from '@/types/lead';
import { X } from 'lucide-react';

export function LostReasonsSettings() {
  const [customLostReasons, setCustomLostReasons] = useState(LOST_REASONS.map(reason => ({ ...reason })));
  const [newLostReason, setNewLostReason] = useState({ id: '', label: '' });

  const handleSave = () => {
    toast.success("Lost Reasons settings updated");
  };

  const handleAddLostReason = () => {
    if (!newLostReason.id || !newLostReason.label) {
      toast.error("Please enter both ID and label for the new lost reason");
      return;
    }

    setCustomLostReasons([...customLostReasons, { ...newLostReason }]);
    setNewLostReason({ id: '', label: '' });
    toast.success("Lost reason added");
  };

  const handleRemoveLostReason = (id: string) => {
    setCustomLostReasons(customLostReasons.filter(reason => reason.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lost Reasons Configuration</CardTitle>
        <CardDescription>
          Configure reasons why leads are lost
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <h3 className="text-sm font-medium mb-4">Current Lost Reasons</h3>
            <div className="space-y-2">
              {customLostReasons.map((reason, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium">{reason.label}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveLostReason(reason.id)}
                    disabled={index < 5} // Prevent removing default reasons
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add New Lost Reason</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-reason-id">ID</Label>
                <Input 
                  id="new-reason-id" 
                  placeholder="e.g. competitor-selected"
                  value={newLostReason.id}
                  onChange={e => setNewLostReason({...newLostReason, id: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="new-reason-label">Label</Label>
                <Input 
                  id="new-reason-label"
                  placeholder="e.g. Competitor Selected" 
                  value={newLostReason.label}
                  onChange={e => setNewLostReason({...newLostReason, label: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleAddLostReason}>Add Lost Reason</Button>
          </div>

          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
