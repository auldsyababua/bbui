import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar as CalendarIcon, Plus, X, Clock, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useNavigate } from 'react-router-dom';
// Mock data
const users = [{
  id: 1,
  name: 'Bryan Johnson',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  initials: 'BJ',
  status: 'available'
}, {
  id: 2,
  name: 'Joel Smith',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  initials: 'JS',
  status: 'busy'
}, {
  id: 3,
  name: 'Colin Davis',
  avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  initials: 'CD',
  status: 'away'
}];
const sites = [{
  id: 1,
  name: 'Eagle Lake'
}, {
  id: 2,
  name: 'West Site'
}, {
  id: 3,
  name: 'North Ridge'
}, {
  id: 4,
  name: 'South Field'
}];
const fieldReports = [{
  id: 1,
  title: 'Daily Inspection - Eagle Lake'
}, {
  id: 2,
  title: 'Solar Panel Maintenance - West Site'
}, {
  id: 3,
  title: 'Equipment Failure - North Ridge'
}, {
  id: 4,
  title: 'New Solar Panel Installation - South Field'
}];
interface TaskFormProps {
  taskToEdit?: {
    id: string;
    title: string;
    description: string;
    assignee: {
      id: number;
      name: string;
    };
    dueDate: Date | null;
    reminderTime: Date | null;
    priority: string;
    status: string;
    site: string;
    relatedReport: string;
    subTasks: Array<{
      id: string;
      title: string;
    }>;
  };
}
export function TaskForm({
  taskToEdit
}: TaskFormProps) {
  const navigate = useNavigate();
  const isEditing = !!taskToEdit;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [assignedTo, setAssignedTo] = useState('');
  const [site, setSite] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [reminderTime, setReminderTime] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState('medium');
  const [relatedReport, setRelatedReport] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // These values are still generated but not displayed to the user
  const [taskId] = useState(isEditing ? taskToEdit.id : `TASK-${Math.floor(100000 + Math.random() * 900000)}`);
  const [subTasks, setSubTasks] = useState<{
    id: string;
    title: string;
  }[]>([]);
  const [newSubTask, setNewSubTask] = useState('');
  // Populate form with task data if editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'todo');
      setAssignedTo(taskToEdit.assignee?.id?.toString() || '');
      setSite(taskToEdit.site || '');
      setDueDate(taskToEdit.dueDate || undefined);
      setReminderTime(taskToEdit.reminderTime || undefined);
      setPriority(taskToEdit.priority || 'medium');
      setRelatedReport(taskToEdit.relatedReport || '');
      setSubTasks(taskToEdit.subTasks || []);
    }
  }, [taskToEdit]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      if (isEditing) {
        alert('Task updated successfully');
      } else {
        alert('Task created successfully');
      }
      // Redirect back to task list
      navigate('/tasks');
    }, 1500);
  };
  const handleCancel = () => {
    navigate('/tasks');
  };
  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, {
        id: Date.now().toString(),
        title: newSubTask.trim()
      }]);
      setNewSubTask('');
    }
  };
  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter(task => task.id !== id));
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      {/* Task Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Task Title <span className="text-red-500">*</span>
        </Label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Enter task title" />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select value={status} onValueChange={setStatus} required>
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="reassigned">Reassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Task Description
        </Label>
        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter task description" className="min-h-[100px] resize-y" />
      </div>

      {/* Assigned To */}
      <div className="space-y-2">
        <Label htmlFor="assigned-to" className="text-sm font-medium">
          Assigned To
        </Label>
        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger id="assigned-to" className="w-full">
            <SelectValue placeholder="Select assignee (defaults to you)" />
          </SelectTrigger>
          <SelectContent>
            {users.map(user => <SelectItem key={user.id} value={user.id.toString()}>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                  <div className={`ml-2 w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                </div>
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Site */}
      <div className="space-y-2">
        <Label htmlFor="site" className="text-sm font-medium">
          Site
        </Label>
        <Select value={site} onValueChange={setSite}>
          <SelectTrigger id="site" className="w-full">
            <SelectValue placeholder="Select a site (optional)" />
          </SelectTrigger>
          <SelectContent>
            {sites.map(site => <SelectItem key={site.id} value={site.id.toString()}>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {site.name}
                </div>
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Related Field Report */}
      <div className="space-y-2">
        <Label htmlFor="related-report" className="text-sm font-medium">
          Related Field Report
        </Label>
        <Select value={relatedReport} onValueChange={setRelatedReport}>
          <SelectTrigger id="related-report" className="w-full">
            <SelectValue placeholder="Select related report (optional)" />
          </SelectTrigger>
          <SelectContent>
            {fieldReports.map(report => <SelectItem key={report.id} value={report.id.toString()}>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  {report.title}
                </div>
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="due-date" className="text-sm font-medium">
          Due Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal" id="due-date">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, 'PPP') : <span>Select due date (optional)</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus disabled={date => date < new Date() && !isEditing} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Reminder Time */}
      <div className="space-y-2">
        <Label htmlFor="reminder-time" className="text-sm font-medium">
          Reminder Time
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal" id="reminder-time">
              <Clock className="mr-2 h-4 w-4" />
              {reminderTime ? format(reminderTime, 'PPP p') : <span>Set reminder (optional)</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="p-4">
              <Calendar mode="single" selected={reminderTime} onSelect={setReminderTime} disabled={date => date < new Date() && !isEditing} />
              {reminderTime && <div className="mt-4">
                  <Label htmlFor="time" className="text-sm font-medium">
                    Time
                  </Label>
                  <Input id="time" type="time" className="mt-1" onChange={e => {
                const [hours, minutes] = e.target.value.split(':').map(Number);
                const date = new Date(reminderTime);
                date.setHours(hours, minutes);
                setReminderTime(date);
              }} />
                </div>}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Priority</Label>
        <RadioGroup value={priority} onValueChange={setPriority} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="flex items-center">
              <span className="text-blue-500 mr-1">🔵</span> Low
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="flex items-center">
              <span className="text-yellow-500 mr-1">🟡</span> Medium
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="flex items-center">
              <span className="text-red-500 mr-1">🔴</span> High
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Sub-tasks */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sub-tasks</Label>
        <div className="space-y-2 border rounded-lg p-4">
          {subTasks.length > 0 ? <div className="space-y-2 mb-4">
              {subTasks.map(task => <div key={task.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-md group">
                  <span className="flex-1">{task.title}</span>
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveSubTask(task.id)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>)}
            </div> : <div className="text-center py-4 text-muted-foreground">
              No sub-tasks added yet
            </div>}
          <div className="flex items-center gap-2">
            <Input value={newSubTask} onChange={e => setNewSubTask(e.target.value)} placeholder="Add sub-task" className="flex-1" />
            <Button type="button" size="sm" onClick={handleAddSubTask} disabled={!newSubTask.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? isEditing ? 'Updating...' : 'Creating...' : isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>;
}