import React from 'react';
import { Button } from '../ui/button';
import { MapPin, User, Calendar } from 'lucide-react';
export function ChatContextIndicator() {
  return <div className="flex items-center justify-between px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          <span>Context: Eagle Lake</span>
        </div>
        <div className="flex items-center">
          <User className="h-3 w-3 mr-1" />
          <span>Acting as: Colin</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Date Range: Today</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-6 text-xs">
        Change Context
      </Button>
    </div>;
}