import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { ChevronLeft, Calendar, Clock, CheckSquare, MoreVertical, Download, Share2, Edit, Copy, Trash2, Plus, GripVertical, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Progress } from '../ui/progress';
import { ListItem } from './ListItem';
const list = {
  id: 'l1',
  title: 'Daily Generator Inspection',
  description: 'Checklist for daily inspection and maintenance of generators at Eagle Lake facility.',
  type: 'checklist',
  createdAt: '2023-05-01T10:00:00Z',
  updatedAt: '2023-05-12T14:30:00Z',
  lastUsed: '2023-05-12T14:30:00Z',
  createdBy: {
    name: 'Colin Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'CD'
  },
  items: [{
    id: 'i1',
    text: 'Check oil levels in primary generator',
    checked: true
  }, {
    id: 'i2',
    text: 'Check oil levels in backup generator',
    checked: true
  }, {
    id: 'i3',
    text: 'Inspect cooling system',
    checked: false
  }, {
    id: 'i4',
    text: 'Check fuel levels',
    checked: true
  }, {
    id: 'i5',
    text: 'Test emergency start procedure',
    checked: false
  }, {
    id: 'i6',
    text: 'Record temperature readings',
    checked: true
  }, {
    id: 'i7',
    text: 'Inspect for any fluid leaks',
    checked: true
  }, {
    id: 'i8',
    text: 'Check battery connections',
    checked: false
  }, {
    id: 'i9',
    text: 'Verify indicator lights functioning properly',
    checked: true
  }, {
    id: 'i10',
    text: 'Document all readings in maintenance log',
    checked: false
  }],
  schedule: 'daily',
  visibility: 'team',
  isTemplate: true,
  location: 'Eagle Lake',
  assignees: [{
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  }, {
    name: 'Joel Smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'JS'
  }]
};
export function ListView() {
  const [items, setItems] = useState(list.items);
  const [newItemText, setNewItemText] = useState('');
  const handleItemCheck = (itemId: string, checked: boolean) => {
    setItems(items.map(item => item.id === itemId ? {
      ...item,
      checked
    } : item));
  };
  const handleAddItem = () => {
    if (newItemText.trim()) {
      setItems([...items, {
        id: `i${Date.now()}`,
        text: newItemText,
        checked: false
      }]);
      setNewItemText('');
    }
  };
  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const completedCount = items.filter(item => item.checked).length;
  const progress = items.length > 0 ? completedCount / items.length * 100 : 0;
  return <div className="container max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Lists
        </Button>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit List
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate List
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share List
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{list.title}</h1>
        <p className="text-muted-foreground mb-4">{list.description}</p>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
            <CheckSquare className="h-3.5 w-3.5 mr-1" />
            Checklist
          </Badge>
          {list.location && <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Location:</span>
              <span>{list.location}</span>
            </div>}
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Last used:</span>
            <span>{formatDate(list.lastUsed)}</span>
          </div>
          {list.schedule && <div className="flex items-center gap-1 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Schedule:</span>
              <span>
                {list.schedule.charAt(0).toUpperCase() + list.schedule.slice(1)}
              </span>
            </div>}
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Progress:</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {items.length} completed
            </span>
          </div>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Assignees:</span>
        <div className="flex -space-x-2">
          {list.assignees.map(assignee => <Avatar key={assignee.initials} className="h-6 w-6 border-2 border-background">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback>{assignee.initials}</AvatarFallback>
            </Avatar>)}
          <Button variant="outline" size="sm" className="h-6 w-6 rounded-full p-0 ml-1">
            <Plus className="h-3 w-3" />
            <span className="sr-only">Add assignee</span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">List Items</CardTitle>
            <Badge variant="outline" className="bg-muted">
              {items.length} items
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {items.map((item, index) => <ListItem key={item.id} item={item} index={index} onCheck={checked => handleItemCheck(item.id, checked)} onDelete={() => handleDeleteItem(item.id)} />)}
          </div>
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <input type="text" placeholder="Add a new item..." value={newItemText} onChange={e => setNewItemText(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-16" onKeyDown={e => {
              if (e.key === 'Enter' && newItemText.trim()) {
                handleAddItem();
              }
            }} />
              <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7" onClick={handleAddItem} disabled={!newItemText.trim()}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" size="sm" className="gap-1">
              <Users className="h-4 w-4" />
              Assign
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Save as Template
              </Button>
              <Button size="sm">Complete List</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}