import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, CheckSquare, FileText, MoreVertical, Clock, ArrowUpDown, Tag, Users, Package, ShoppingCart } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
const mockLists = [{
  id: 'l1',
  name: 'Daily Generator Inspection',
  type: 'checklist',
  owner: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  site: 'Eagle Lake',
  itemCount: 10,
  completedCount: 6,
  lastModified: '2023-05-12T14:30:00Z',
  status: 'active'
}, {
  id: 'l2',
  name: 'Quarterly Equipment Inventory',
  type: 'inventory',
  owner: {
    name: 'Joel Smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'JS'
  },
  site: 'West Site',
  itemCount: 45,
  completedCount: 0,
  lastModified: '2023-05-10T09:15:00Z',
  status: 'active'
}, {
  id: 'l3',
  name: 'Safety Procedure - Power Outage',
  type: 'procedure',
  owner: {
    name: 'Colin Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'CD'
  },
  site: 'All Sites',
  itemCount: 8,
  completedCount: 0,
  lastModified: '2023-04-28T11:20:00Z',
  status: 'archived'
}, {
  id: 'l4',
  name: 'Maintenance Supplies Order',
  type: 'shopping',
  owner: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  site: 'North Ridge',
  itemCount: 12,
  completedCount: 5,
  lastModified: '2023-05-11T15:45:00Z',
  status: 'active'
}];
export function ListList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState(['checklist', 'inventory', 'procedure', 'shopping']);
  const [selectedStatuses, setSelectedStatuses] = useState(['active', 'archived']);
  const filteredLists = mockLists.filter(list => {
    // Text search
    const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase()) || list.site.toLowerCase().includes(searchQuery.toLowerCase());
    // Tab filter
    const matchesTab = activeTab === 'all' || activeTab === 'mine' && list.owner.name === 'Bryan Johnson' || activeTab === 'active' && list.status === 'active';
    // Type and status filters
    const matchesType = selectedTypes.includes(list.type);
    const matchesStatus = selectedStatuses.includes(list.status);
    return matchesSearch && matchesTab && matchesType && matchesStatus;
  });
  const toggleType = (type: string, e: React.MouseEvent) => {
    // Prevent dropdown from closing
    e.preventDefault();
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
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
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checklist':
        return <CheckSquare className="h-4 w-4 text-blue-600" />;
      case 'inventory':
        return <Package className="h-4 w-4 text-purple-600" />;
      case 'procedure':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'shopping':
        return <ShoppingCart className="h-4 w-4 text-amber-600" />;
      default:
        return <Tag className="h-4 w-4 text-gray-600" />;
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checklist':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'inventory':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'procedure':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'shopping':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
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
  return <div className="container max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lists</h1>
        <Button size="sm" onClick={() => navigate('/lists/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </div>
      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Lists</TabsTrigger>
            <TabsTrigger value="mine">My Lists</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search lists, sites..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                List Type
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('checklist')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'checklist']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'checklist'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 mr-2">
                  Checklist
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('inventory')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'inventory']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'inventory'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-purple-100 text-purple-700 mr-2">
                  Inventory
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('procedure')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'procedure']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'procedure'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-green-100 text-green-700 mr-2">
                  Procedure
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('shopping')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'shopping']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'shopping'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-amber-100 text-amber-700 mr-2">
                  Shopping
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-semibold">
                Status
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={selectedStatuses.includes('active')} onCheckedChange={checked => {
              if (checked) {
                setSelectedStatuses([...selectedStatuses, 'active']);
              } else {
                setSelectedStatuses(selectedStatuses.filter(s => s !== 'active'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-green-100 text-green-700 mr-2">
                  Active
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedStatuses.includes('archived')} onCheckedChange={checked => {
              if (checked) {
                setSelectedStatuses([...selectedStatuses, 'archived']);
              } else {
                setSelectedStatuses(selectedStatuses.filter(s => s !== 'archived'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-gray-100 text-gray-700 mr-2">
                  Archived
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
                Last Modified (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Last Modified (Oldest)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Owner
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="h-4 w-4 mr-2" />
                List Type
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-4">
        {filteredLists.length > 0 ? filteredLists.map(list => <Card key={list.id} className="hover:shadow-md transition-all cursor-pointer" onClick={() => navigate(`/lists/${list.id}`)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-base truncate">
                          {list.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(list.type)}
                            <span>
                              {list.type.charAt(0).toUpperCase() + list.type.slice(1)}
                            </span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated {formatDate(list.lastModified)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={getTypeColor(list.type)}>
                          {list.type.charAt(0).toUpperCase() + list.type.slice(1)}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(list.status)}>
                          {list.status.charAt(0).toUpperCase() + list.status.slice(1)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={e => {
                        e.stopPropagation();
                        navigate(`/lists/${list.id}`);
                      }}>
                              View List
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={e => e.stopPropagation()}>
                              Edit List
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={e => e.stopPropagation()}>
                              Duplicate List
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={e => e.stopPropagation()} className="text-red-600">
                              Delete List
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={list.owner.avatar} alt={list.owner.name} />
                            <AvatarFallback>
                              {list.owner.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{list.owner.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Tag className="h-3.5 w-3.5" />
                          <span>{list.site}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        {list.type === 'checklist' || list.type === 'shopping' ? <span>
                            {list.completedCount} of {list.itemCount} completed
                          </span> : <span>{list.itemCount} items</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>) : <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-muted-foreground">No lists match your filters</p>
            <Button variant="link" className="mt-2" onClick={() => {
          setSearchQuery('');
          setActiveTab('all');
          setSelectedTypes(['checklist', 'inventory', 'procedure', 'shopping']);
          setSelectedStatuses(['active', 'archived']);
        }}>
              Clear all filters
            </Button>
          </div>}
      </div>
    </div>;
}