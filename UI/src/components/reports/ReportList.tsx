import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, MapPin, User, FileText, MoreVertical, Clock, ArrowUpDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '../ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
const mockReports = [{
  id: 'r1',
  title: 'Daily Inspection - Eagle Lake',
  type: 'inspection',
  location: 'Eagle Lake - Generator Building',
  createdAt: '2023-05-12T10:00:00Z',
  createdBy: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  issues: [{
    id: 'i1',
    severity: 'warning',
    text: 'Minor oil leak on generator 2'
  }],
  photos: 2,
  status: 'complete'
}, {
  id: 'r2',
  title: 'Solar Panel Maintenance - West Site',
  type: 'maintenance',
  location: 'West Site - Solar Array',
  createdAt: '2023-05-11T14:30:00Z',
  createdBy: {
    name: 'Joel Smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'JS'
  },
  issues: [],
  photos: 4,
  status: 'complete'
}, {
  id: 'r3',
  title: 'Equipment Failure - North Ridge',
  type: 'incident',
  location: 'North Ridge - Cooling Station',
  createdAt: '2023-05-10T08:15:00Z',
  createdBy: {
    name: 'Colin Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'CD'
  },
  issues: [{
    id: 'i2',
    severity: 'critical',
    text: 'Cooling system failure'
  }, {
    id: 'i3',
    severity: 'warning',
    text: 'Backup system activated'
  }],
  photos: 3,
  status: 'pending'
}, {
  id: 'r4',
  title: 'New Solar Panel Installation - South Field',
  type: 'installation',
  location: 'South Field - Expansion Area',
  createdAt: '2023-05-09T11:45:00Z',
  createdBy: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  issues: [{
    id: 'i4',
    severity: 'info',
    text: 'Installation completed ahead of schedule'
  }],
  photos: 6,
  status: 'complete'
}];
export function ReportList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState(['inspection', 'maintenance', 'incident', 'installation']);
  const [selectedStatuses, setSelectedStatuses] = useState(['complete', 'pending']);
  const filteredReports = mockReports.filter(report => {
    // Text search
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || report.location.toLowerCase().includes(searchQuery.toLowerCase());
    // Tab filter
    const matchesTab = activeTab === 'all' || activeTab === 'mine' && report.createdBy.name === 'Bryan Johnson' || activeTab === 'recent' && new Date(report.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    // Type and status filters
    const matchesType = selectedTypes.includes(report.type);
    const matchesStatus = selectedStatuses.includes(report.status);
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
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'inspection':
        return 'Inspection';
      case 'maintenance':
        return 'Maintenance';
      case 'incident':
        return 'Incident';
      case 'installation':
        return 'Installation';
      default:
        return type;
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'inspection':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'incident':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'installation':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
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
        <h1 className="text-2xl font-bold">Field Reports</h1>
        <Button size="sm" onClick={() => navigate('/reports/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>
      <div className="mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="mine">My Reports</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports, locations..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                Report Type
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('inspection')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'inspection']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'inspection'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 mr-2">
                  Inspection
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('maintenance')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'maintenance']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'maintenance'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-green-100 text-green-700 mr-2">
                  Maintenance
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('incident')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'incident']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'incident'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-red-100 text-red-700 mr-2">
                  Incident
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedTypes.includes('installation')} onCheckedChange={checked => {
              if (checked) {
                setSelectedTypes([...selectedTypes, 'installation']);
              } else {
                setSelectedTypes(selectedTypes.filter(t => t !== 'installation'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-purple-100 text-purple-700 mr-2">
                  Installation
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-semibold">
                Status
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={selectedStatuses.includes('complete')} onCheckedChange={checked => {
              if (checked) {
                setSelectedStatuses([...selectedStatuses, 'complete']);
              } else {
                setSelectedStatuses(selectedStatuses.filter(s => s !== 'complete'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-green-100 text-green-700 mr-2">
                  Complete
                </Badge>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={selectedStatuses.includes('pending')} onCheckedChange={checked => {
              if (checked) {
                setSelectedStatuses([...selectedStatuses, 'pending']);
              } else {
                setSelectedStatuses(selectedStatuses.filter(s => s !== 'pending'));
              }
            }} onSelect={e => e.preventDefault()}>
                <Badge variant="outline" className="bg-amber-100 text-amber-700 mr-2">
                  Pending
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
                Date (Newest)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Date (Oldest)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Creator
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-4">
        {filteredReports.length > 0 ? filteredReports.map(report => <Card key={report.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-base truncate">
                          {report.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[200px]">
                              {report.location}
                            </span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDate(report.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={getTypeColor(report.type)}>
                          {getTypeLabel(report.type)}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(report.status)}>
                          {report.status === 'complete' ? 'Complete' : 'Pending'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Report</DropdownMenuItem>
                            <DropdownMenuItem>Download PDF</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={report.createdBy.avatar} alt={report.createdBy.name} />
                            <AvatarFallback>
                              {report.createdBy.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {report.createdBy.name}
                          </span>
                        </div>
                        {report.photos > 0 && <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{report.photos} photos</span>
                          </div>}
                      </div>
                      <div className="flex gap-2">
                        {report.issues.map(issue => {
                    let icon;
                    if (issue.severity === 'critical') {
                      icon = <AlertTriangle className="h-3.5 w-3.5 text-red-600" />;
                    } else if (issue.severity === 'warning') {
                      icon = <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />;
                    } else {
                      icon = <CheckCircle className="h-3.5 w-3.5 text-blue-600" />;
                    }
                    return <Badge key={issue.id} variant="outline" className="text-xs flex items-center gap-1">
                              {icon}
                              <span className="truncate max-w-[150px]">
                                {issue.text}
                              </span>
                            </Badge>;
                  })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>) : <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              No reports match your filters
            </p>
            <Button variant="link" className="mt-2" onClick={() => {
          setSearchQuery('');
          setActiveTab('all');
          setSelectedTypes(['inspection', 'maintenance', 'incident', 'installation']);
          setSelectedStatuses(['complete', 'pending']);
        }}>
              Clear all filters
            </Button>
          </div>}
      </div>
    </div>;
}