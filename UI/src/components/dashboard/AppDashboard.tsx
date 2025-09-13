import React from 'react';
import { AppCard } from './AppCard';
import { Brain, FileSearch, Calculator, BarChart3, Users, FileText, List, CheckSquare, Bell, Archive } from 'lucide-react';
const apps = [{
  id: 'brainbot',
  title: 'Brain Bot',
  description: 'AI-powered assistant for intelligent operations support',
  icon: Brain,
  accentColor: 'blue',
  beta: true,
  disabled: false,
  comingSoon: false,
  path: '/brainbot'
}, {
  id: 'docs',
  title: 'Document Viewer',
  description: 'Access and search operational documentation',
  icon: FileSearch,
  accentColor: 'teal',
  beta: false,
  disabled: false,
  comingSoon: false,
  path: '/docs'
}, {
  id: 'markup',
  title: 'Markup Manager',
  description: 'Manage partner markup percentages and financial data',
  icon: Calculator,
  accentColor: 'red',
  beta: false,
  disabled: true,
  comingSoon: true,
  path: '/markup'
}, {
  id: 'analytics',
  title: 'Analytics',
  description: 'Visualize operational metrics and performance data',
  icon: BarChart3,
  accentColor: 'blue',
  beta: false,
  disabled: true,
  comingSoon: true,
  path: '/analytics'
}, {
  id: 'investors',
  title: 'Investor Portal',
  description: 'Create custom dashboards for partners and stakeholders',
  icon: Users,
  accentColor: 'purple',
  beta: false,
  disabled: false,
  comingSoon: false,
  path: '/investors'
}];
const flrtsApps = [{
  id: 'reports',
  title: 'Field Reports',
  description: 'Submit and review field reports with multimedia support',
  icon: FileText,
  accentColor: 'blue',
  beta: false,
  disabled: false,
  comingSoon: false,
  path: '/reports'
}, {
  id: 'lists',
  title: 'Lists',
  description: 'Create and manage dynamic lists and checklists',
  icon: List,
  accentColor: 'green',
  beta: false,
  disabled: false,
  comingSoon: false,
  path: '/lists'
}, {
  id: 'tasks',
  title: 'Tasks',
  description: 'Create and manage tasks with natural language input',
  icon: CheckSquare,
  accentColor: 'purple',
  beta: false,
  disabled: false,
  comingSoon: false,
  path: '/tasks'
}, {
  id: 'reminders',
  title: 'Reminders',
  description: 'Set up notifications and reminders for important events',
  icon: Bell,
  accentColor: 'orange',
  beta: false,
  disabled: false,
  comingSoon: false,
  path: '/reminders'
}, {
  id: 'archive',
  title: 'Archive',
  description: 'Access and search archived tasks, lists, and reports',
  icon: Archive,
  accentColor: 'gray',
  beta: false,
  disabled: false,
  comingSoon: false,
  path: '/archive'
}];
export function AppDashboard() {
  return <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Apps</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apps.map(app => <AppCard key={app.id} {...app} />)}
      </div>
      <h1 className="text-3xl font-bold tracking-tight mt-12 mb-8">FLRTS</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {flrtsApps.map(app => <AppCard key={app.id} {...app} />)}
      </div>
    </div>;
}