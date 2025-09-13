import React from 'react';
import { Button } from '../ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { TaskForm } from '../forms/TaskForm';
// Mock task data for editing
const mockTasks = [{
  id: 't1',
  title: 'Check generator oil levels at Eagle Lake',
  assignee: {
    id: 1,
    name: 'Bryan Johnson'
  },
  description: 'Perform routine check of generator oil levels and top up if necessary.',
  dueDate: new Date('2023-05-12T15:00:00'),
  priority: 'high',
  status: 'in-progress',
  site: '1',
  relatedReport: '1',
  reminderTime: new Date('2023-05-12T14:30:00'),
  subTasks: [{
    id: 'st1',
    title: 'Check primary generator'
  }, {
    id: 'st2',
    title: 'Check backup generator'
  }]
}, {
  id: 't2',
  title: 'Clean solar panels at West Site',
  assignee: {
    id: 2,
    name: 'Joel Smith'
  },
  description: 'Clean all solar panels to ensure optimal performance.',
  dueDate: new Date('2023-05-13T09:00:00'),
  priority: 'medium',
  status: 'todo',
  site: '2',
  relatedReport: '',
  reminderTime: null,
  subTasks: []
}];
export function TaskEdit() {
  const navigate = useNavigate();
  const {
    id
  } = useParams<{
    id: string;
  }>();
  // Find the task to edit
  const task = mockTasks.find(t => t.id === id);
  if (!task) {
    return <div className="container max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/tasks')}>
            <ChevronLeft className="h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The task you're trying to edit doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/tasks')}>Return to Tasks</Button>
        </div>
      </div>;
  }
  return <div className="container max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/tasks')}>
          <ChevronLeft className="h-4 w-4" />
          Back to Tasks
        </Button>
      </div>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Edit Task</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <TaskForm taskToEdit={task} />
        </div>
      </div>
    </div>;
}