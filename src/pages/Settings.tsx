
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { PipelineSettings } from '@/components/settings/PipelineSettings';
import { LostReasonsSettings } from '@/components/settings/LostReasonsSettings';
import { ProposalStatusSettings } from '@/components/settings/ProposalStatusSettings';
import { NotificationsSettings } from '@/components/settings/NotificationsSettings';

const Settings = () => {
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
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
          <PipelineSettings />
        </TabsContent>

        <TabsContent value="lost-reasons" className="mt-6">
          <LostReasonsSettings />
        </TabsContent>

        <TabsContent value="proposal-status" className="mt-6">
          <ProposalStatusSettings />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationsSettings />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
