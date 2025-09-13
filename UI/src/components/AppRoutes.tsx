import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TaskList } from './tasks/TaskList';
import { TaskCreate } from './tasks/TaskCreate';
import { TaskEdit } from './tasks/TaskEdit';
import { ReportList } from './reports/ReportList';
import { ReportCreate } from './reports/ReportCreate';
import { ListList } from './lists/ListList';
import { ListCreate } from './lists/ListCreate';
import { ListView } from './lists/ListView';
import { BrainBotChat } from './brainbot/BrainBotChat';
import { ArchiveList } from './archive/ArchiveList';
import { AppDashboard } from './dashboard/AppDashboard';
export function AppRoutes() {
  return <Routes>
      <Route path="/" element={<AppDashboard />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/tasks/create" element={<TaskCreate />} />
      <Route path="/tasks/edit/:id" element={<TaskEdit />} />
      <Route path="/reports" element={<ReportList />} />
      <Route path="/reports/create" element={<ReportCreate />} />
      <Route path="/lists" element={<ListList />} />
      <Route path="/lists/create" element={<ListCreate />} />
      <Route path="/lists/:id" element={<ListView />} />
      <Route path="/brainbot" element={<BrainBotChat />} />
      <Route path="/archive" element={<ArchiveList />} />
      <Route path="/settings" element={<div className="container p-6">
            <h1 className="text-2xl font-bold">Settings Page</h1>
          </div>} />
    </Routes>;
}