
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

export function PipelineSettings() {
  const handleSave = () => {
    toast.success("Pipeline settings updated");
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
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="mb-4">
              <Label>Default Pipeline Stages</Label>
              <p className="text-sm text-muted-foreground">
                These are the default stages for the lead pipeline
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-opportunity-purple" />
                  <Label>New</Label>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-opportunity-blue" />
                  <Label>Qualified</Label>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-opportunity-orange" />
                  <Label>Proposal</Label>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-opportunity-green" />
                  <Label>Won</Label>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-opportunity-red" />
                  <Label>Lost</Label>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-6 mb-2">Custom pipeline stages coming in a future update</p>

          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
