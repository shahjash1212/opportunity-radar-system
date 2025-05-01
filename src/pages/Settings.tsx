
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { LOST_REASONS, PROPOSAL_STATUSES } from '@/types/lead';
import { X } from 'lucide-react';

const Settings = () => {
  const [customLostReasons, setCustomLostReasons] = useState(LOST_REASONS.map(reason => ({ ...reason })));
  const [customProposalStatuses, setCustomProposalStatuses] = useState(PROPOSAL_STATUSES.map(status => ({ ...status })));
  const [newLostReason, setNewLostReason] = useState({ id: '', label: '' });
  const [newProposalStatus, setNewProposalStatus] = useState({ id: '', label: '' });

  const handleSave = (section: string) => {
    toast.success(`${section} settings updated`);
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

  const handleAddProposalStatus = () => {
    if (!newProposalStatus.id || !newProposalStatus.label) {
      toast.error("Please enter both ID and label for the new proposal status");
      return;
    }

    setCustomProposalStatuses([...customProposalStatuses, { ...newProposalStatus }]);
    setNewProposalStatus({ id: '', label: '' });
    toast.success("Proposal status added");
  };

  const handleRemoveLostReason = (id: string) => {
    setCustomLostReasons(customLostReasons.filter(reason => reason.id !== id));
  };

  const handleRemoveProposalStatus = (id: string) => {
    setCustomProposalStatuses(customProposalStatuses.filter(status => status.id !== id));
  };

  return (
    <MainLayout title="Settings">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Stages</TabsTrigger>
          <TabsTrigger value="lost-reasons">Lost Reasons</TabsTrigger>
          <TabsTrigger value="proposal-status">Proposal Status</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Acme Corp" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (EST/EDT)</SelectItem>
                    <SelectItem value="cst">Central Time (CST/CDT)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST/PDT)</SelectItem>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => handleSave('General')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
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

                <Button onClick={() => handleSave('Pipeline')}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lost-reasons" className="mt-6">
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

                <Button onClick={() => handleSave('Lost Reasons')}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposal-status" className="mt-6">
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

                <Button onClick={() => handleSave('Proposal Statuses')}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure your notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="new-lead">New Lead Notifications</Label>
                  <Switch id="new-lead" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="stage-change">Stage Change Notifications</Label>
                  <Switch id="stage-change" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="comment-notification">Comment Notifications</Label>
                  <Switch id="comment-notification" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="assignment">Assignment Notifications</Label>
                  <Switch id="assignment" defaultChecked />
                </div>

                <Button onClick={() => handleSave('Notifications')}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
