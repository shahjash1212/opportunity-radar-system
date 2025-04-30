
import { Comment, Lead, PipelineStage, PriorityLevel, LeadSource, User } from "../types/lead";

// Mock users
export const USERS: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", name: "Robert Johnson", email: "robert@example.com", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "4", name: "Emily Davis", email: "emily@example.com", avatar: "https://i.pravatar.cc/150?img=4" },
];

// Helper for generating random leads
const generateRandomLead = (id: string): Lead => {
  const stages: PipelineStage[] = ['new', 'qualified', 'proposal', 'won', 'lost'];
  const priorities: PriorityLevel[] = ['low', 'medium', 'high'];
  const sources: LeadSource[] = ['website', 'referral', 'outbound', 'event', 'other'];
  const companies = [
    'Acme Corp', 
    'Globex', 
    'Initech', 
    'Stark Industries',
    'Wayne Enterprises',
    'Pied Piper',
    'Dunder Mifflin',
    'Umbrella Corp',
    'Cyberdyne Systems',
    'Massive Dynamic'
  ];

  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const createdAt = randomDate(new Date(2023, 0, 1), new Date());
  const updatedAt = randomDate(createdAt, new Date());
  const randomUser = USERS[Math.floor(Math.random() * USERS.length)];

  return {
    id,
    name: `Lead ${id}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    estimatedValue: Math.floor(Math.random() * 100000) + 5000,
    stage: stages[Math.floor(Math.random() * stages.length)],
    owner: Math.random() > 0.2 ? randomUser : undefined,
    createdAt,
    updatedAt,
    comments: [] as Comment[],
    notes: Math.random() > 0.5 ? "Some notes about this lead..." : undefined,
  };
};

// Generate mock leads
export const generateMockLeads = (count: number = 20): Lead[] => {
  return Array.from({ length: count }, (_, i) => generateRandomLead(`${i + 1}`));
};

// Mock data service
let mockLeads = generateMockLeads();

export const getLeads = (): Promise<Lead[]> => {
  return Promise.resolve([...mockLeads]);
};

export const getLead = (id: string): Promise<Lead | undefined> => {
  const lead = mockLeads.find(lead => lead.id === id);
  return Promise.resolve(lead ? { ...lead } : undefined);
};

export const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Promise<Lead> => {
  const newLead: Lead = {
    ...lead,
    id: (mockLeads.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: []
  };
  
  mockLeads = [...mockLeads, newLead];
  return Promise.resolve({ ...newLead });
};

export const updateLead = (id: string, updates: Partial<Lead>): Promise<Lead | undefined> => {
  const index = mockLeads.findIndex(lead => lead.id === id);
  if (index === -1) return Promise.resolve(undefined);
  
  mockLeads[index] = { 
    ...mockLeads[index],
    ...updates,
    updatedAt: new Date()
  };
  
  return Promise.resolve({ ...mockLeads[index] });
};

export const deleteLead = (id: string): Promise<boolean> => {
  const initialLength = mockLeads.length;
  mockLeads = mockLeads.filter(lead => lead.id !== id);
  return Promise.resolve(mockLeads.length < initialLength);
};

export const addComment = (leadId: string, text: string, author: User): Promise<Comment | undefined> => {
  const leadIndex = mockLeads.findIndex(lead => lead.id === leadId);
  if (leadIndex === -1) return Promise.resolve(undefined);
  
  const comment: Comment = {
    id: `comment-${Date.now()}`,
    text,
    createdAt: new Date(),
    author
  };
  
  mockLeads[leadIndex].comments.push(comment);
  mockLeads[leadIndex].updatedAt = new Date();
  
  return Promise.resolve({ ...comment });
};
