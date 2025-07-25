import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { ChevronLeft, MapPin, Calendar, Clock, FileText, Download, MessageSquare, Paperclip, MoreVertical, CheckCircle, AlertTriangle, AlertCircle, User, Edit, Printer, Share2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
const report = {
  id: 'r3',
  title: 'Equipment Failure - North Ridge',
  type: 'incident',
  location: 'North Ridge - Cooling Station',
  description: 'At approximately 8:15 AM, the primary cooling system at North Ridge experienced a complete shutdown. The backup system was automatically activated, and it is currently maintaining operational temperatures. An initial assessment suggests a potential compressor failure in the primary unit.',
  createdAt: '2023-05-10T08:15:00Z',
  updatedAt: '2023-05-10T10:30:00Z',
  createdBy: {
    name: 'Colin Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'CD',
    role: 'Maintenance Supervisor'
  },
  status: 'pending',
  issues: [{
    id: 'i2',
    severity: 'critical',
    text: 'Cooling system failure - primary unit non-operational'
  }, {
    id: 'i3',
    severity: 'warning',
    text: 'Backup system activated - estimated 72 hour runtime on current fuel levels'
  }],
  photos: [{
    id: 'p1',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    caption: 'Primary cooling unit control panel',
    timestamp: '2023-05-10T08:20:00Z'
  }, {
    id: 'p2',
    url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    caption: 'Compressor unit showing signs of failure',
    timestamp: '2023-05-10T08:25:00Z'
  }, {
    id: 'p3',
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    caption: 'Backup system operational status',
    timestamp: '2023-05-10T08:30:00Z'
  }],
  comments: [{
    id: 'c1',
    user: {
      name: 'Joel Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      initials: 'JS'
    },
    content: "I've contacted the manufacturer about the compressor and they're sending a replacement part tomorrow morning.",
    timestamp: '2023-05-10T09:45:00Z',
    attachments: []
  }, {
    id: 'c2',
    user: {
      name: 'Bryan Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      initials: 'BJ'
    },
    content: "I've checked the backup system fuel levels and should have enough for 72 hours of operation. I'll arrange for a refill tomorrow to be safe.",
    timestamp: '2023-05-10T10:15:00Z',
    attachments: [{
      id: 'a1',
      name: 'fuel_levels.pdf',
      type: 'pdf',
      size: '1.2 MB'
    }]
  }],
  attachments: [{
    id: 'a1',
    name: 'cooling_system_specs.pdf',
    type: 'pdf',
    size: '3.4 MB'
  }, {
    id: 'a2',
    name: 'incident_log.xlsx',
    type: 'excel',
    size: '0.8 MB'
  }, {
    id: 'a3',
    name: 'temperature_readings.csv',
    type: 'csv',
    size: '0.3 MB'
  }],
  actions: [{
    id: 'act1',
    description: 'Contact manufacturer for replacement parts',
    assignee: 'Joel Smith',
    status: 'completed'
  }, {
    id: 'act2',
    description: 'Monitor backup system performance',
    assignee: 'Bryan Johnson',
    status: 'in-progress'
  }, {
    id: 'act3',
    description: 'Schedule repair technician visit',
    assignee: 'Colin Davis',
    status: 'pending'
  }]
};
export function ReportDetail() {
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'info':
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      console.log('Submitting comment:', newComment);
      setNewComment('');
    }
  };
  return <div className="container max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Reports
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
                Edit Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Delete Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className={getTypeColor(report.type)}>
            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
          </Badge>
          <Badge variant="outline" className={getStatusColor(report.status)}>
            {report.status === 'complete' ? 'Complete' : 'Pending'}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{report.location}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(report.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(report.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Avatar className="h-10 w-10">
          <AvatarImage src={report.createdBy.avatar} alt={report.createdBy.name} />
          <AvatarFallback>{report.createdBy.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{report.createdBy.name}</p>
          <p className="text-sm text-muted-foreground">
            {report.createdBy.role}
          </p>
        </div>
      </div>
      <Tabs defaultValue="details" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">
                {report.description}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Issues & Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.issues.map(issue => <div key={issue.id} className="flex items-start gap-2 p-3 bg-muted/50 rounded-md">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1 text-sm">{issue.text}</div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {report.attachments.map(attachment => <div key={attachment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {attachment.size}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {report.photos.map(photo => <div key={photo.id} className="space-y-2">
                    <div className="rounded-md overflow-hidden border aspect-video">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{photo.caption}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(photo.timestamp)}
                      </p>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                {report.comments.map(comment => <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {comment.user.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.timestamp)} at{' '}
                          {formatTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                      {comment.attachments.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                          {comment.attachments.map(attachment => <div key={attachment.id} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                              <Paperclip className="h-3 w-3" />
                              <span>{attachment.name}</span>
                            </div>)}
                        </div>}
                    </div>
                  </div>)}
              </div>
              <form onSubmit={handleSubmitComment}>
                <div className="relative">
                  <Textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." className="min-h-[80px] pr-16 resize-none" />
                  <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                    <Button type="submit" size="sm" disabled={!newComment.trim()}>
                      Post
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.actions.map(action => <div key={action.id} className="p-3 border rounded-md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {action.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{action.assignee}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={getActionStatusColor(action.status)}>
                        {action.status.charAt(0).toUpperCase() + action.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>)}
              </div>
              <Button className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Action Item
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}