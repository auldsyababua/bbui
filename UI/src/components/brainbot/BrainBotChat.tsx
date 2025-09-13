import React, { useEffect, useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Brain, Send, Mic, Image, Paperclip, MoreVertical, RefreshCw, Copy, ThumbsUp, ThumbsDown, Sparkles, Zap, Clock, Lightbulb, Download, Pin, PanelLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
// Mock data for chat history
const initialMessages = [{
  id: 'm1',
  role: 'system',
  content: "Hello! I'm Brain Bot, your AI assistant for the FLRTS system. How can I help you today?",
  timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
}, {
  id: 'm2',
  role: 'user',
  content: 'Can you help me understand how to create a field report?',
  timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString()
}, {
  id: 'm3',
  role: 'system',
  content: 'Of course! Creating a field report is simple. Navigate to the "Field Reports" section from the dashboard, then click on the "New Report" button. You\'ll need to fill in details like the report title, location, type, and description. You can also add photos, attachments, and document any issues or observations. Once you\'ve completed all the necessary information, click "Submit Report" to finalize it.\n\nWould you like me to walk you through each section of the report form in more detail?',
  timestamp: new Date(Date.now() - 1000 * 60 * 3.5).toISOString()
}, {
  id: 'm4',
  role: 'user',
  content: 'What are the different types of reports I can create?',
  timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString()
}, {
  id: 'm5',
  role: 'system',
  content: 'In the FLRTS system, you can create four types of reports:\n\n1. **Inspection** - For routine checks and evaluations of equipment and facilities\n2. **Maintenance** - For documenting maintenance work performed on equipment\n3. **Incident** - For reporting unexpected events, failures, or accidents\n4. **Installation** - For documenting new equipment installations or upgrades\n\nEach report type has slightly different fields and focuses, but they all follow the same general submission process. The type you choose should reflect the primary purpose of your field activity.',
  timestamp: new Date(Date.now() - 1000 * 60 * 2.5).toISOString()
}];
// Suggested prompts for the user
const suggestedPrompts = ['How do I assign tasks to team members?', "What's the best way to document equipment failures?", 'Can you help me create a daily inspection checklist?', 'How do I export reports as PDF?', 'What data should I include in an incident report?'];
export function BrainBotChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsThinking(true);
    setShowSuggestions(false);
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: `ai-${Date.now()}`,
        role: 'system',
        content: generateMockResponse(inputValue),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 2000);
  };
  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    // Focus the input after setting the value
    document.getElementById('message-input')?.focus();
  };
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Simple mock response generator - in a real app, this would be an API call
  const generateMockResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('task') && lowerInput.includes('assign')) {
      return "To assign tasks to team members, go to the Task Manager and click 'New Task'. Enter the task details, then select the assignee from the dropdown menu. You can also create tasks with natural language by typing something like 'Tell Bryan to check generator oil at Eagle Lake tomorrow at 3pm' in the task creation field.";
    }
    if (lowerInput.includes('equipment') && lowerInput.includes('fail')) {
      return "When documenting equipment failures, create an 'Incident' type report in the Field Reports section. Make sure to include:\n\n1. Exact time and date of the failure\n2. Equipment identification information\n3. Detailed description of the failure\n4. Any warning signs that preceded the failure\n5. Photos of the affected equipment\n6. Initial assessment of cause (if known)\n7. Any emergency measures taken\n\nYou should also create action items for follow-up tasks like repairs or further investigation.";
    }
    if (lowerInput.includes('checklist') || lowerInput.includes('inspection')) {
      return "To create a daily inspection checklist, go to the List Manager and select 'New List'. Choose 'Checklist' as the type, give it a title like 'Daily Generator Inspection', and add all the items that need to be checked daily. You can set the schedule to 'Daily' and assign team members who will be responsible for completing it. Once created, this checklist can be reused every day, with a new instance generated automatically based on the schedule.";
    }
    if (lowerInput.includes('export') || lowerInput.includes('pdf')) {
      return "To export a report as PDF, open the specific report you want to export, click the 'Actions' button in the top-right corner, and select 'Download PDF' from the dropdown menu. The system will generate a professionally formatted PDF document containing all the report information, photos, and attachments that can be saved locally or shared with others.";
    }
    return 'I understand your question about ' + input.split(' ').slice(0, 3).join(' ') + "... To address this properly, I'd need to gather more specific information from our knowledge base. In a fully implemented system, I would connect to the FLRTS database and documentation to provide you with accurate information. Can you provide more details about what specifically you're trying to accomplish?";
  };
  return <div className="container max-w-4xl mx-auto p-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Brain Bot</h1>
            <p className="text-sm text-muted-foreground">
              AI-powered assistant for FLRTS
            </p>
          </div>
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
            <Sparkles className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                New Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Chat
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Clock className="h-4 w-4 mr-2" />
                View History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {message.role === 'user' ? <>
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                      <AvatarFallback>BJ</AvatarFallback>
                    </> : <>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </>}
                </Avatar>
                <div className={`space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                    <span>{formatTimestamp(message.timestamp)}</span>
                    {message.role === 'system' && <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Pin className="h-3 w-3" />
                        </Button>
                      </div>}
                  </div>
                </div>
              </div>
            </div>)}
          {isThinking && <div className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    <Brain className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="px-4 py-2 rounded-lg bg-muted">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-300"></div>
                    <span className="text-sm text-muted-foreground ml-1">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 pt-2">
          <div className="flex items-end gap-2 w-full">
            <div className="flex-1 relative">
              <Textarea id="message-input" placeholder="Message Brain Bot..." className="min-h-[80px] resize-none pr-10" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }} />
              <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6">
                  <Image className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Button type="button" className="h-10 w-10 bg-blue-600 hover:bg-blue-700" onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>;
}