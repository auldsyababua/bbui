import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TaskCard } from './TaskCard';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, ArrowUpDown, Calendar, User, Tag, CheckCircle2, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
const mockTasks = [{
  id: 't1',
  title: 'Check generator oil levels at Eagle Lake',
  assignee: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  dueDate: 'Today at 3:00 PM',
  priority: 'high',
  status: 'in-progress',
  location: 'Eagle Lake - Generator Building',
  tags: ['maintenance', 'generator'],
  createdAt: '2023-05-12T10:00:00Z',
  updatedAt: '2023-05-12T14:30:00Z'
}, {
  id: 't2',
  title: 'Clean solar panels at West Site',
  assignee: {
    name: 'Joel Smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'JS'
  },
  dueDate: 'Tomorrow at 9:00 AM',
  priority: 'medium',
  status: 'todo',
  location: 'West Site - Solar Array',
  tags: ['maintenance', 'solar'],
  createdAt: '2023-05-11T16:20:00Z',
  updatedAt: '2023-05-11T16:20:00Z'
}, {
  id: 't3',
  title: 'Review quarterly maintenance report',
  assignee: {
    name: 'Colin Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'CD'
  },
  dueDate: 'Friday at 5:00 PM',
  priority: 'normal',
  status: 'todo',
  location: null,
  tags: ['report', 'admin'],
  createdAt: '2023-05-10T09:15:00Z',
  updatedAt: '2023-05-10T09:15:00Z'
}, {
  id: 't4',
  title: 'Inspect cooling system at North Ridge',
  assignee: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  dueDate: 'Yesterday at 1:00 PM',
  priority: 'high',
  status: 'completed',
  location: 'North Ridge - Cooling Station',
  tags: ['maintenance', 'cooling'],
  createdAt: '2023-05-08T13:45:00Z',
  updatedAt: '2023-05-09T14:30:00Z'
}];
export function TaskList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPriorities, setSelectedPriorities] = useState(['high', 'medium', 'normal', 'low']);
  const [selectedStatuses, setSelectedStatuses] = useState(['todo', 'in-progress', 'completed']);
  const filteredTasks = mockTasks.filter(task => {
    // Text search
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || task.location && task.location.toLowerCase().includes(searchQuery.toLowerCase());
    // Tab filter
    const matchesTab = activeTab === 'all' || activeTab === 'mine' && task.assignee.name === 'Bryan Johnson' || activeTab === 'overdue' && new Date(task.dueDate) < new Date() || activeTab === 'today' && task.dueDate.includes('Today');
    // Priority and status filters
    const matchesPriority = selectedPriorities.includes(task.priority);
    const matchesStatus = selectedStatuses.includes(task.status);
    return matchesSearch && matchesTab && matchesPriority && matchesStatus;
  });
  const togglePriority = (priority: string, e: React.MouseEvent) => {
    // Prevent dropdown from closing
    e.preventDefault();
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };
  const toggleStatus = (status: string, e: React.MouseEvent) => {
    // Prevent dropdown from closing
    e.preventDefault();
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };
  return <div className="container max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button size="sm" onClick={() => navigate('/tasks/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="mine">My Tasks</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks, tags, or locations..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="font-semibold">
                Priority
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={selectedPriorities.includes('high')} onCheckedChange={checked => {
              if (checked) {
                setSelectedPriorities([...selectedPriorities, 'high']);
              } else {
                setSelectedPriorities(selectedPriorities.filter(p => p !== 'high'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-red-100 text-red-700 mr-2">
                  High
                </Badge>
                High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedPriorities.includes('medium')} onCheckedChange={checked => {
              if (checked) {
                setSelectedPriorities([...selectedPriorities, 'medium']);
              } else {
                setSelectedPriorities(selectedPriorities.filter(p => p !== 'medium'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-orange-100 text-orange-700 mr-2">
                  Medium
                </Badge>
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedPriorities.includes('normal')} onCheckedChange={checked => {
              if (checked) {
                setSelectedPriorities([...selectedPriorities, 'normal']);
              } else {
                setSelectedPriorities(selectedPriorities.filter(p => p !== 'normal'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 mr-2">
                  Normal
                </Badge>
                Normal
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedPriorities.includes('low')} onCheckedChange={checked => {
              if (checked) {
                setSelectedPriorities([...selectedPriorities, 'low']);
              } else {
                setSelectedPriorities(selectedPriorities.filter(p => p !== 'low'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-gray-100 text-gray-700 mr-2">
                  Low
                </Badge>
                Low
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-semibold">
                Status
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={selectedStatuses.includes('todo')} onCheckedChange={checked => {
              if (checked) {
                setSelectedStatuses([...selectedStatuses, 'todo']);
              } else {
                setSelectedStatuses(selectedStatuses.filter(s => s !== 'todo'));
              }
            }} onSelect={e => e.preventDefault()}>
                To Do
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedStatuses.includes('in-progress')} onCheckedChange={checked => {
              if (checked) {
                setSelectedStatuses([...selectedStatuses, 'in-progress']);
              } else {
                setSelectedStatuses(selectedStatuses.filter(s => s !== 'in-progress'));
              }
            }} onSelect={e => e.preventDefault()}>
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedStatuses.includes('completed')} onCheckedChange={checked => {
              if (checked) {
                setSelectedStatuses([...selectedStatuses, 'completed']);
              } else {
                setSelectedStatuses(selectedStatuses.filter(s => s !== 'completed'));
              }
            }} onSelect={e => e.preventDefault()}>
                Completed
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="h-4 w-4 mr-2" />
                Created Date
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Assignee
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="h-4 w-4 mr-2" />
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-4">
        {filteredTasks.length > 0 ? filteredTasks.map(task => <TaskCard key={task.id} task={task} />) : <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-muted-foreground">No tasks match your filters</p>
            <Button variant="link" className="mt-2" onClick={() => {
          setSearchQuery('');
          setActiveTab('all');
          setSelectedPriorities(['high', 'medium', 'normal', 'low']);
          setSelectedStatuses(['todo', 'in-progress', 'completed']);
        }}>
              Clear all filters
            </Button>
          </div>}
      </div>
    </div>;
}