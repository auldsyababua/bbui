import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Filter, ArrowUpDown, Archive, CheckSquare, FileText, List, Clock, Calendar, Tag, MoreVertical, Undo } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// Mock archived items
const archivedItems = [{
  id: 't1',
  title: 'Replace backup generator filters',
  type: 'task',
  assignee: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  site: 'Eagle Lake',
  archivedDate: '2023-04-15T10:30:00Z',
  tags: ['maintenance', 'generator']
}, {
  id: 'l1',
  title: 'Monthly Equipment Inspection',
  type: 'list',
  assignee: {
    name: 'Joel Smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'JS'
  },
  site: 'West Site',
  archivedDate: '2023-04-20T15:45:00Z',
  tags: ['inspection', 'equipment']
}, {
  id: 'r1',
  title: 'Q1 Solar Panel Performance Report',
  type: 'report',
  assignee: {
    name: 'Colin Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'CD'
  },
  site: 'North Ridge',
  archivedDate: '2023-03-31T09:15:00Z',
  tags: ['report', 'solar']
}, {
  id: 't2',
  title: 'Update emergency contact information',
  type: 'task',
  assignee: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  site: 'All Sites',
  archivedDate: '2023-04-10T11:20:00Z',
  tags: ['admin', 'safety']
}, {
  id: 'l2',
  title: 'Winter Preparation Checklist',
  type: 'list',
  assignee: {
    name: 'Joel Smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'JS'
  },
  site: 'All Sites',
  archivedDate: '2023-02-28T16:40:00Z',
  tags: ['seasonal', 'preparation']
}];
export function ArchiveList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState(['task', 'list', 'report']);
  const filteredItems = archivedItems.filter(item => {
    // Text search
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.site.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    // Tab filter
    const matchesTab = activeTab === 'all' || activeTab === 'tasks' && item.type === 'task' || activeTab === 'lists' && item.type === 'list' || activeTab === 'reports' && item.type === 'report';
    // Type filter
    const matchesType = selectedTypes.includes(item.type);
    return matchesSearch && matchesTab && matchesType;
  });
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4 text-purple-600" />;
      case 'list':
        return <List className="h-4 w-4 text-green-600" />;
      case 'report':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <Archive className="h-4 w-4 text-gray-600" />;
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'list':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'report':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const handleRestore = (id: string, type: string) => {
    console.log(`Restoring ${type} with id ${id}`);
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} has been restored`);
  };
  const handlePermanentDelete = (id: string, type: string) => {
    console.log(`Permanently deleting ${type} with id ${id}`);
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} has been permanently deleted`);
  };
  return <div className="container max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Archive</h1>
      </div>
      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="lists">Lists</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search archived items..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                Item Type
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('task')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'task']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'task'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-purple-100 text-purple-700 mr-2">
                  Task
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('list')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'list']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'list'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-green-100 text-green-700 mr-2">
                  List
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('report')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'report']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'report'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 mr-2">
                  Report
                </Badge>
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
                Date Archived (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Date Archived (Oldest)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="h-4 w-4 mr-2" />
                Item Type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-4">
        {filteredItems.length > 0 ? filteredItems.map(item => <Card key={item.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-base truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(item.type)}
                            <span>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              Archived on {formatDate(item.archivedDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={getTypeColor(item.type)}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRestore(item.id, item.type)}>
                              <Undo className="mr-2 h-4 w-4" />
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handlePermanentDelete(item.id, item.type)}>
                              Permanently Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={item.assignee.avatar} alt={item.assignee.name} />
                            <AvatarFallback>
                              {item.assignee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{item.assignee.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Tag className="h-3.5 w-3.5" />
                          <span>{item.site}</span>
                        </div>
                      </div>
                      {item.tags.length > 0 && <div className="flex items-center gap-2">
                          {item.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-muted">
                              {tag}
                            </Badge>)}
                        </div>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>) : <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              No archived items match your filters
            </p>
            <Button variant="link" className="mt-2" onClick={() => {
          setSearchQuery('');
          setActiveTab('all');
          setSelectedTypes(['task', 'list', 'report']);
        }}>
              Clear all filters
            </Button>
          </div>}
      </div>
    </div>;
}