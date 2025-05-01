
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, PipelineStage, User, LostReason, ProposalStatus } from '../types/lead';
import { getLeads, addLead, updateLead, deleteLead, addComment, USERS } from '../data/mockData';
import { toast } from '../components/ui/sonner';

interface LeadContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  createLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<Lead | undefined>;
  updateLeadData: (id: string, updates: Partial<Lead>) => Promise<Lead | undefined>;
  removeLead: (id: string) => Promise<boolean>;
  moveLead: (leadId: string, newStage: PipelineStage) => Promise<Lead | undefined>;
  addLeadComment: (leadId: string, text: string, userId: string) => Promise<boolean>;
  assignLead: (leadId: string, userId: string | undefined) => Promise<Lead | undefined>;
  setLostReason: (leadId: string, reason: LostReason) => Promise<Lead | undefined>;
  setProposalStatus: (leadId: string, status: ProposalStatus) => Promise<Lead | undefined>;
  users: User[];
  currentUser: User;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const users = USERS;
  const currentUser = users[0]; // Default to first user

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    try {
      const newLead = await addLead(lead);
      setLeads(prevLeads => [...prevLeads, newLead]);
      toast.success("Lead created successfully");
      return newLead;
    } catch (err) {
      toast.error("Failed to create lead");
      console.error(err);
      return undefined;
    }
  };

  const updateLeadData = async (id: string, updates: Partial<Lead>) => {
    try {
      const updatedLead = await updateLead(id, updates);
      if (updatedLead) {
        setLeads(prevLeads => 
          prevLeads.map(lead => lead.id === id ? updatedLead : lead)
        );
        toast.success("Lead updated successfully");
      }
      return updatedLead;
    } catch (err) {
      toast.error("Failed to update lead");
      console.error(err);
      return undefined;
    }
  };

  const removeLead = async (id: string) => {
    try {
      const success = await deleteLead(id);
      if (success) {
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
        toast.success("Lead deleted successfully");
      }
      return success;
    } catch (err) {
      toast.error("Failed to delete lead");
      console.error(err);
      return false;
    }
  };

  const moveLead = async (leadId: string, newStage: PipelineStage) => {
    const updates: Partial<Lead> = { stage: newStage };
    
    // Clear stage-specific fields when moving to a different stage
    if (newStage !== 'lost') {
      updates.lostReason = undefined;
    }
    
    if (newStage !== 'proposal') {
      updates.proposalStatus = undefined;
    }
    
    return updateLeadData(leadId, updates);
  };

  const setLostReason = async (leadId: string, reason: LostReason) => {
    return updateLeadData(leadId, { lostReason: reason });
  };

  const setProposalStatus = async (leadId: string, status: ProposalStatus) => {
    return updateLeadData(leadId, { proposalStatus: status });
  };

  const addLeadComment = async (leadId: string, text: string, userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return false;
      
      const updatedLead = await updateLead(leadId, { 
        comments: [
          ...leads.find(l => l.id === leadId)?.comments || [], 
          { id: Date.now().toString(), text, createdAt: new Date(), author: user }
        ]
      });
      
      if (updatedLead) {
        setLeads(prevLeads => 
          prevLeads.map(lead => lead.id === leadId ? updatedLead : lead)
        );
        toast.success("Comment added");
        return true;
      }
      return false;
    } catch (err) {
      toast.error("Failed to add comment");
      console.error(err);
      return false;
    }
  };

  const assignLead = async (leadId: string, userId: string | undefined) => {
    try {
      const owner = userId ? users.find(u => u.id === userId) : undefined;
      return updateLeadData(leadId, { owner });
    } catch (err) {
      toast.error("Failed to assign lead");
      console.error(err);
      return undefined;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const value = {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
    updateLeadData,
    removeLead,
    moveLead,
    addLeadComment,
    assignLead,
    setLostReason,
    setProposalStatus,
    users,
    currentUser,
  };

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
};

export const useLeadContext = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeadContext must be used within a LeadProvider');
  }
  return context;
};
