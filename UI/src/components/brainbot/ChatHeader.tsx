import React, { useState } from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Brain, Settings, ChevronDown } from 'lucide-react';
export function ChatHeader() {
  const [model, setModel] = useState('GPT-4');
  const [context, setContext] = useState('All Sites');
  const [isOnline, setIsOnline] = useState(true);
  return <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-blue-600" />
          <span className="font-medium">Brain Bot</span>
          <div className={`ml-2 h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <span className="mx-2">·</span>
          <span>Model:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-auto px-1 py-0 ml-1">
                {model}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setModel('GPT-4')}>
                GPT-4 (Default)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModel('GPT-3.5')}>
                GPT-3.5 (Faster)
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                Claude 3 (Coming soon)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:flex items-center text-sm text-muted-foreground">
          <span className="mx-2">·</span>
          <span>Context:</span>
          <Button variant="ghost" size="sm" className="h-auto px-1 py-0 ml-1">
            {context}
          </Button>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Settings className="h-4 w-4" />
        <span className="sr-only">Settings</span>
      </Button>
    </div>;
}