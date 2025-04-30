
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Lead, PIPELINE_STAGES } from '@/types/lead';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeLabel } from '@/components/ui/badge-label';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLeadContext } from '@/context/LeadContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Send } from 'lucide-react';

interface ViewLeadDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewLeadDialog({ lead, open, onOpenChange }: ViewLeadDialogProps) {
  const { users, currentUser, assignLead, addLeadComment } = useLeadContext();
  const [comment, setComment] = useState('');

  if (!lead) return null;
  
  const stageConfig = PIPELINE_STAGES.find((stage) => stage.id === lead.stage) || PIPELINE_STAGES[0];
  
  const handleAssign = async (userId: string) => {
    await assignLead(lead.id, userId);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() === '') return;
    
    const success = await addLeadComment(lead.id, comment, currentUser.id);
    if (success) {
      setComment('');
    }
  };

  const priorityColors = {
    low: '#10B981',
    medium: '#F97316',
    high: '#EF4444',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {lead.name}
            <span className="text-sm text-muted-foreground ml-2">
              ({lead.company})
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeLabel
              text={stageConfig.name}
              color={stageConfig.color}
              className="text-sm"
            />
            <BadgeLabel
              text={lead.priority.toUpperCase()}
              color={priorityColors[lead.priority]}
              className="text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Assign to:</p>
            <Select
              defaultValue={lead.owner?.id || ''}
              onValueChange={(value) => handleAssign(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : (
                          <AvatarFallback>
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments ({lead.comments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium mb-1">Source:</p>
                <p className="capitalize">{lead.source}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Estimated Value:</p>
                <p className="text-xl font-bold">{formatCurrency(lead.estimatedValue)}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Created:</p>
                <p>{formatDateTime(lead.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Last Updated:</p>
                <p>{formatDateTime(lead.updatedAt)}</p>
              </div>
            </div>
            
            {lead.notes && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  <p className="text-sm font-medium">Notes</p>
                </div>
                <div className="p-3 bg-accent rounded-md text-sm">
                  {lead.notes}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="comments" className="mt-4">
            <ScrollArea className="h-[200px]">
              {lead.comments.length > 0 ? (
                <div className="space-y-4">
                  {lead.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="w-8 h-8">
                        {comment.author.avatar ? (
                          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        ) : (
                          <AvatarFallback>
                            {comment.author.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <p className="font-medium text-sm">{comment.author.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(comment.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No comments yet
                </p>
              )}
            </ScrollArea>
            
            <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[80px]"
              />
              <Button type="submit" size="sm" className="h-10">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
