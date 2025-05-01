
export type PipelineStage = 'new' | 'qualified' | 'proposal' | 'won' | 'lost';

export type PriorityLevel = 'low' | 'medium' | 'high';

export type LeadSource = 'website' | 'referral' | 'outbound' | 'event' | 'other';

export type LostReason = 'budget' | 'not-interested' | 'out-of-scope' | 'resource-unavailable' | 'other';

export type ProposalStatus = 'meeting-scheduled' | 'meeting-completed' | 'brd-sent' | 'quote-sent' | 'negotiation' | 'other';

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
  lostReason?: LostReason;
  proposalStatus?: ProposalStatus;
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

export const LOST_REASONS = [
  { id: 'budget', label: 'Budget Constraints' },
  { id: 'not-interested', label: 'Not Interested' },
  { id: 'out-of-scope', label: 'Out of Scope' },
  { id: 'resource-unavailable', label: 'Resource Unavailable' },
  { id: 'other', label: 'Other' }
];

export const PROPOSAL_STATUSES = [
  { id: 'meeting-scheduled', label: 'Meeting Scheduled' },
  { id: 'meeting-completed', label: 'Meeting Completed' },
  { id: 'brd-sent', label: 'BRD Sent' },
  { id: 'quote-sent', label: 'Quote Sent' },
  { id: 'negotiation', label: 'In Negotiation' },
  { id: 'other', label: 'Other' }
];
