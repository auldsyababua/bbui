import React from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { FieldReportForm } from '../forms/FieldReportForm';
export function ReportCreate() {
  const navigate = useNavigate();
  return <div className="container max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/reports')}>
          <ChevronLeft className="h-4 w-4" />
          Back to Reports
        </Button>
      </div>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Create New Field Report</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <FieldReportForm />
        </div>
      </div>
    </div>;
}