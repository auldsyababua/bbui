import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Brain, Copy, Edit, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
const messages = [{
  id: 1,
  type: 'system',
  content: "You're now viewing Eagle Lake data only",
  timestamp: '3:40 PM'
}, {
  id: 2,
  type: 'user',
  content: "Can you summarize today's field reports from Eagle Lake?",
  timestamp: '3:42 PM',
  user: {
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'JD'
  }
}, {
  id: 3,
  type: 'bot',
  content: `Here's today's summary for Eagle Lake:
**3 Field Reports:**
1. ✅ Morning inspection - All systems normal
2. ⚠️ Generator 2 - Minor oil leak detected
3. ✅ Solar panel cleaning completed
**Action Required:**
- Generator 2 needs follow-up maintenance`,
  timestamp: '3:42 PM',
  actions: [{
    label: 'Create Task',
    action: 'create-task'
  }, {
    label: 'View Reports',
    action: 'view-reports'
  }]
}];
export function ChatMessages() {
  return <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Brain className="h-12 w-12 mb-4 text-muted" />
          <p className="text-lg font-medium">
            Ask me anything about your operations...
          </p>
          <p className="text-sm mt-2 max-w-md">
            I can help with tasks, reports, analytics, and more.
          </p>
        </div> : messages.map(message => {
      if (message.type === 'system') {
        return <div key={message.id} className="flex justify-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                  📢 System: {message.content}
                </div>
              </div>;
      } else if (message.type === 'user') {
        return <div key={message.id} className="flex items-start gap-3 max-w-3xl ml-auto">
                <div className="flex-1 bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">
                      {message.user.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                </div>
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={message.user.avatar} />
                  <AvatarFallback>{message.user.initials}</AvatarFallback>
                </Avatar>
              </div>;
      } else if (message.type === 'bot') {
        return <div key={message.id} className="flex items-start gap-3 max-w-3xl">
                <Avatar className="h-8 w-8 mt-1 bg-blue-100">
                  <Brain className="h-5 w-5 text-blue-700" />
                </Avatar>
                <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm flex items-center">
                      <Brain className="h-4 w-4 mr-1 text-blue-600" />
                      Brain Bot
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </div>
                  </div>
                  <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none">
                    {message.content}
                  </div>
                  {message.actions && <div className="flex flex-wrap gap-2 mt-4">
                      {message.actions.map((action, index) => <Button key={index} size="sm" variant="outline">
                          {action.label}
                        </Button>)}
                      <Button size="sm" variant="ghost">
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                    </div>}
                  <div className="flex items-center justify-between mt-4 pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="sr-only">Helpful</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <ThumbsDown className="h-4 w-4" />
                        <span className="sr-only">Not helpful</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      Report Issue
                    </Button>
                  </div>
                </div>
              </div>;
      }
    })}
    </div>;
}