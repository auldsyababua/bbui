import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Paperclip, Mic, Send } from 'lucide-react';
export function ChatInput() {
  const [message, setMessage] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };
  return <div className="p-4 border-t">
      <div className="flex flex-wrap gap-2 mb-2">
        <Button variant="ghost" size="sm" className="h-7 text-xs bg-muted/50">
          Today's Summary
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs bg-muted/50">
          Open Tasks
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs bg-muted/50">
          Recent Reports
        </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask about tasks, reports, or operations..." className="min-h-[80px] pr-24 resize-none" />
          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button type="submit" size="icon" className="h-8 w-8">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </form>
    </div>;
}