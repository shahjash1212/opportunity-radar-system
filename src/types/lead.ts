
export type PipelineStage = 'new' | 'qualified' | 'proposal' | 'won' | 'lost';

export type PriorityLevel = 'low' | 'medium' | 'high';

export type LeadSource = 'website' | 'referral' | 'outbound' | 'event' | 'other';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  author: User;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  source: LeadSource;
  priority: PriorityLevel;
  estimatedValue: number;
  stage: PipelineStage;
  owner?: User;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  notes?: string;
  attachments?: string[];
}

export interface StageConfig {
  id: PipelineStage;
  name: string;
  color: string;
}

export const PIPELINE_STAGES: StageConfig[] = [
  { id: 'new', name: 'New', color: '#9b87f5' },
  { id: 'qualified', name: 'Qualified', color: '#0EA5E9' },
  { id: 'proposal', name: 'Proposal Sent', color: '#F97316' },
  { id: 'won', name: 'Won', color: '#10B981' },
  { id: 'lost', name: 'Lost', color: '#EF4444' },
];
