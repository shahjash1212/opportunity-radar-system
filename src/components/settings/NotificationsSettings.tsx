
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';

export function NotificationsSettings() {
  const handleSave = () => {
    toast.success("Notifications settings updated");
  };

  return (
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

          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
