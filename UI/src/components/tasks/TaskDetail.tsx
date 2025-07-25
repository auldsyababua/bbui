import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { MapPin, Clock, Tag, MessageSquare, Paperclip, CheckSquare, ChevronLeft, Calendar, Bell, AlertCircle, Edit, Trash2, User, Flag } from 'lucide-react';
import { cn } from '../../lib/utils';
const task = {
  id: 't1',
  title: 'Check generator oil levels at Eagle Lake',
  description: 'Perform a routine check of the oil levels in the primary and backup generators. If levels are below 50%, refill and document the amount added. Also check for any leaks or unusual wear.',
  assignee: {
    name: 'Bryan Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'BJ'
  },
  dueDate: 'Today at 3:00 PM',
  reminder: '30 minutes before',
  priority: 'high',
  status: 'in-progress',
  location: 'Eagle Lake - Generator Building',
  tags: ['maintenance', 'generator'],
  createdAt: '2023-05-12T10:00:00Z',
  updatedAt: '2023-05-12T14:30:00Z',
  createdBy: {
    name: 'Colin Davis',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    initials: 'CD'
  },
  subtasks: [{
    id: 'st1',
    title: 'Check primary generator oil',
    completed: true
  }, {
    id: 'st2',
    title: 'Check backup generator oil',
    completed: false
  }, {
    id: 'st3',
    title: 'Document oil levels in maintenance log',
    completed: false
  }, {
    id: 'st4',
    title: 'Inspect for leaks',
    completed: true
  }],
  comments: [{
    id: 'c1',
    user: {
      name: 'Colin Davis',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      initials: 'CD'
    },
    content: 'Make sure to check both generators thoroughly. The backup had some issues last week.',
    timestamp: '2 hours ago',
    attachments: []
  }, {
    id: 'c2',
    user: {
      name: 'Bryan Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      initials: 'BJ'
    },
    content: 'I have checked the primary generator. Oil levels are at 65 percent. No leaks have been detected since 45 minutes ago.',
    attachments: [{
      id: 'a1',
      name: 'generator_reading.jpg',
      type: 'image',
      size: '1.2 MB'
    }]
  }],
  attachments: [{
    id: 'a1',
    name: 'maintenance_protocol.pdf',
    type: 'pdf',
    size: '2.4 MB'
  }, {
    id: 'a2',
    name: 'generator_manual.pdf',
    type: 'pdf',
    size: '5.7 MB'
  }]
};
export function TaskDetail() {
  const [newComment, setNewComment] = useState('');
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'todo':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      console.log('Submitting comment:', newComment);
      setNewComment('');
    }
  };
  const handleToggleSubtask = (subtaskId: string, checked: boolean) => {
    console.log(`Subtask ${subtaskId} toggled to ${checked}`);
  };
  return <div className="container max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Tasks
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Task Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">
                  {task.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {task.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority} priority
                </Badge>
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Completed'}
                </Badge>
                {task.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-muted">
                    {tag}
                  </Badge>)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {task.location && <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{task.location}</span>
                  </div>}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{task.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>{task.reminder}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Subtasks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">
                  Subtasks
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Add Subtask
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {task.subtasks.map(subtask => <li key={subtask.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={subtask.completed} onChange={e => handleToggleSubtask(subtask.id, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className={cn('text-sm', subtask.completed && 'line-through text-muted-foreground')}>
                      {subtask.title}
                    </span>
                  </li>)}
              </ul>
            </CardContent>
          </Card>
          {/* Comments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                {task.comments.map(comment => <div key={comment.id} className="flex gap-3">
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
                          {comment.timestamp}
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
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Assignee</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Created by</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.createdBy.avatar} alt={task.createdBy.name} />
                    <AvatarFallback>{task.createdBy.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.createdBy.name}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Reassign
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {task.attachments.map(attachment => <div key={attachment.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">
                      {attachment.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {attachment.size}
                  </span>
                </div>)}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                <Paperclip className="h-4 w-4 mr-2" />
                Add Attachment
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Updated {new Date(task.updatedAt).toLocaleString()}</p>
                <p>Created {new Date(task.createdAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}