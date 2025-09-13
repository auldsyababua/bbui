import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { MapPin, Clock, Tag, MoreVertical, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
// Mock data for users to reassign to
const users = [{
  id: 1,
  name: 'Bryan Johnson',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  initials: 'BJ'
}, {
  id: 2,
  name: 'Joel Smith',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  initials: 'JS'
}, {
  id: 3,
  name: 'Colin Davis',
  avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  initials: 'CD'
}];
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    assignee: {
      name: string;
      avatar: string;
      initials: string;
    };
    dueDate: string;
    priority: string;
    status: string;
    location: string | null;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
}
export function TaskCard({
  task
}: TaskCardProps) {
  const navigate = useNavigate();
  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate.includes('Yesterday');
  // Assume current user is Bryan Johnson for this example
  const currentUser = 'Bryan Johnson';
  const isAssignedToCurrentUser = task.assignee.name === currentUser;
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
  const handleStatusChange = (checked: boolean) => {
    // In a real app, this would update the task status in the backend
    console.log(`Task ${task.id} status changed to ${checked ? 'completed' : 'todo'}`);
    // You could show a toast notification here
    alert(`Task marked as ${checked ? 'completed' : 'to do'}`);
  };
  const handleTaskClick = () => {
    console.log(`Opening task ${task.id}`);
  };
  const handleEditTask = () => {
    navigate(`/tasks/edit/${task.id}`);
  };
  const handleReassignTask = (userId: number) => {
    const user = users.find(u => u.id === userId);
    console.log(`Reassigning task ${task.id} to ${user?.name}`);
    // You could show a toast notification here
    alert(`Task reassigned to ${user?.name}`);
  };
  const handleDeleteTask = () => {
    console.log(`Archiving task ${task.id}`);
    // You could show a toast notification here
    alert(`Task archived successfully`);
  };
  return <Card className={cn('transition-all hover:shadow-md', isCompleted && 'opacity-60')}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {isAssignedToCurrentUser ? <Checkbox checked={isCompleted} onCheckedChange={handleStatusChange} className="mt-1" /> : <div className="w-4 h-4 mt-1" /> // Placeholder for spacing when checkbox is not shown
        }
          <div className="flex-1 min-w-0" onClick={handleTaskClick}>
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn('font-medium text-base line-clamp-2', isCompleted && 'line-through text-muted-foreground')}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Completed'}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditTask}>
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Reassign</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="p-0">
                        {users.map(user => <DropdownMenuItem key={user.id} onClick={() => handleReassignTask(user.id)}>
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </DropdownMenuItem>)}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={handleDeleteTask}>
                      Archive Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
              {task.location && <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate max-w-[200px]">
                    {task.location}
                  </span>
                </div>}
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span className={cn(isOverdue && !isCompleted && 'text-red-600 font-medium')}>
                  {task.dueDate}
                </span>
              </div>
              {task.tags.length > 0 && <div className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  <span>{task.tags.join(', ')}</span>
                </div>}
            </div>
          </div>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback>{task.assignee.initials}</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>;
}