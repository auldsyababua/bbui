import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar as CalendarIcon, Clock, BellRing, Search, MapPin, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TimePickerDemo } from './TimePicker';
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
const tasks = [{
  id: 1,
  title: 'Check generator oil at Eagle Lake'
}, {
  id: 2,
  title: 'Clean solar panels at West Site'
}, {
  id: 3,
  title: 'Review quarterly maintenance report'
}, {
  id: 4,
  title: 'Inspect cooling system at North Ridge'
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
export function ReminderForm() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<Date | undefined>(new Date());
  const [remindWho, setRemindWho] = useState('');
  const [relatedTask, setRelatedTask] = useState('');
  const [relatedSite, setRelatedSite] = useState('');
  const [notificationChannels, setNotificationChannels] = useState<string[]>(['telegram']);
  const [recurrence, setRecurrence] = useState('none');
  const [showRecurrenceBuilder, setShowRecurrenceBuilder] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskSearch, setTaskSearch] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      alert('Reminder set successfully');
    }, 1500);
  };
  const handleQuickTimeSelection = (hours: number, minutes: number = 0) => {
    const newTime = new Date();
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    newTime.setSeconds(0);
    setTime(newTime);
  };
  const toggleNotificationChannel = (channel: string) => {
    if (notificationChannels.includes(channel)) {
      setNotificationChannels(notificationChannels.filter(c => c !== channel));
    } else {
      setNotificationChannels([...notificationChannels, channel]);
    }
  };
  const handleRecurrenceChange = (value: string) => {
    setRecurrence(value);
    setShowRecurrenceBuilder(value === 'custom');
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
  const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(taskSearch.toLowerCase()));
  return <form onSubmit={handleSubmit} className="space-y-6 font-['IBM_Plex_Sans']">
      <div className="text-2xl font-bold">New Reminder</div>
      {/* Reminder Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Reminder Title <span className="text-red-500">*</span>
        </Label>
        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} maxLength={255} required placeholder="Enter reminder title" />
        <div className="text-xs text-muted-foreground text-right">
          {title.length}/255
        </div>
      </div>
      {/* Date & Time */}
      <div className="space-y-2">
        <Label htmlFor="date-time" className="text-sm font-medium">
          Date & Time <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal" id="date">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <div className="flex gap-1">
            <TimePickerDemo date={time} setDate={setTime} />
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <Button type="button" variant="outline" size="sm" onClick={() => handleQuickTimeSelection(9)}>
            Start of day (9am)
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => handleQuickTimeSelection(12)}>
            Lunch (12pm)
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => handleQuickTimeSelection(17)}>
            End of day (5pm)
          </Button>
        </div>
      </div>
      {/* Remind Who */}
      <div className="space-y-2">
        <Label htmlFor="remind-who" className="text-sm font-medium">
          Remind Who <span className="text-red-500">*</span>
        </Label>
        <Select value={remindWho} onValueChange={setRemindWho} required>
          <SelectTrigger id="remind-who" className="w-full">
            <SelectValue placeholder="Select user to remind" />
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
      {/* Related Task */}
      <div className="space-y-2">
        <Label htmlFor="related-task" className="text-sm font-medium">
          Related Task
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={taskSearch} onChange={e => setTaskSearch(e.target.value)} placeholder="Search tasks..." className="pl-9 mb-2" />
        </div>
        <Select value={relatedTask} onValueChange={setRelatedTask}>
          <SelectTrigger id="related-task" className="w-full">
            <SelectValue placeholder="Select related task (optional)" />
          </SelectTrigger>
          <SelectContent>
            {filteredTasks.map(task => <SelectItem key={task.id} value={task.id.toString()}>
                {task.title}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {/* Related Site */}
      <div className="space-y-2">
        <Label htmlFor="related-site" className="text-sm font-medium">
          Related Site
        </Label>
        <Select value={relatedSite} onValueChange={setRelatedSite}>
          <SelectTrigger id="related-site" className="w-full">
            <SelectValue placeholder="Select related site (optional)" />
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
      {/* Notification Channels */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Notification Channels</Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="telegram" checked={notificationChannels.includes('telegram')} onCheckedChange={() => toggleNotificationChannel('telegram')} />
            <Label htmlFor="telegram" className="text-sm">
              Telegram
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="email" checked={notificationChannels.includes('email')} onCheckedChange={() => toggleNotificationChannel('email')} />
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sms" checked={notificationChannels.includes('sms')} onCheckedChange={() => toggleNotificationChannel('sms')} />
            <Label htmlFor="sms" className="text-sm">
              SMS
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="push" checked={notificationChannels.includes('push')} onCheckedChange={() => toggleNotificationChannel('push')} />
            <Label htmlFor="push" className="text-sm">
              Push
            </Label>
          </div>
        </div>
      </div>
      {/* Recurrence */}
      <div className="space-y-2">
        <Label htmlFor="recurrence" className="text-sm font-medium">
          Recurrence
        </Label>
        <Select value={recurrence} onValueChange={handleRecurrenceChange}>
          <SelectTrigger id="recurrence" className="w-full">
            <SelectValue placeholder="Select recurrence pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <div className="flex items-center">
                <BellRing className="h-4 w-4 mr-2" />
                None (one-time)
              </div>
            </SelectItem>
            <SelectItem value="daily">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Daily
              </div>
            </SelectItem>
            <SelectItem value="weekly">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Weekly
              </div>
            </SelectItem>
            <SelectItem value="monthly">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Monthly
              </div>
            </SelectItem>
            <SelectItem value="custom">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Custom
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Custom Recurrence Builder */}
      {showRecurrenceBuilder && <div className="space-y-4 border rounded-md p-4 bg-muted/30">
          <h3 className="font-medium">Custom Recurrence</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="repeat-every" className="text-sm">
                Repeat every
              </Label>
              <div className="flex gap-2">
                <Input id="repeat-every" type="number" min="1" defaultValue="1" className="w-20" />
                <Select defaultValue="week">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day(s)</SelectItem>
                    <SelectItem value="week">Week(s)</SelectItem>
                    <SelectItem value="month">Month(s)</SelectItem>
                    <SelectItem value="year">Year(s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ends-on" className="text-sm">
                Ends
              </Label>
              <Select defaultValue="never">
                <SelectTrigger id="ends-on">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="after">After occurrences</SelectItem>
                  <SelectItem value="on-date">On date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>}
      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes
        </Label>
        <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any additional notes" className="min-h-[100px] resize-y" />
      </div>
      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Setting...' : 'Set Reminder'}
        </Button>
      </div>
    </form>;
}