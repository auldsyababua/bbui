import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { X, Calendar as CalendarIcon, Upload, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../ui/switch';
// Mock data for sites
const sites = [{
  id: 1,
  name: 'Eagle Lake',
  status: 'active'
}, {
  id: 2,
  name: 'West Site',
  status: 'active'
}, {
  id: 3,
  name: 'North Ridge',
  status: 'maintenance'
}, {
  id: 4,
  name: 'South Field',
  status: 'inactive'
}, {
  id: 5,
  name: 'East Valley',
  status: 'active'
}];
// Mock data for ASICs
const asics = [{
  id: 1,
  name: 'ASIC-001'
}, {
  id: 2,
  name: 'ASIC-002'
}, {
  id: 3,
  name: 'ASIC-003'
}, {
  id: 4,
  name: 'ASIC-004'
}, {
  id: 5,
  name: 'ASIC-005'
}];
// Mock data for equipment
const equipment = [{
  id: 1,
  name: 'Generator A'
}, {
  id: 2,
  name: 'Solar Panel Array B'
}, {
  id: 3,
  name: 'Cooling System C'
}, {
  id: 4,
  name: 'Battery Bank D'
}, {
  id: 5,
  name: 'Transformer E'
}];
export function FieldReportForm() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [site, setSite] = useState('');
  const [selectedAsics, setSelectedAsics] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const [saveViewPreference, setSaveViewPreference] = useState(false);
  // These values are still generated but not displayed to the user
  const [reportId] = useState(`REP-${Math.floor(100000 + Math.random() * 900000)}`);
  const [submissionTimestamp] = useState(new Date().toISOString());
  // Load user preferences on component mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('reportFormAdvancedDetails');
    if (savedPreference) {
      setShowAdvancedDetails(savedPreference === 'true');
      setSaveViewPreference(true);
    }
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Save view preference if selected
    if (saveViewPreference) {
      localStorage.setItem('reportFormAdvancedDetails', showAdvancedDetails.toString());
    }
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      alert('Report submitted successfully');
      // Redirect to reports list
      navigate('/reports');
    }, 1500);
  };
  const handleCancel = () => {
    navigate('/reports');
  };
  const toggleAdvancedDetails = () => {
    setShowAdvancedDetails(!showAdvancedDetails);
  };
  const handleRemoveAsic = (asicId: string) => {
    setSelectedAsics(selectedAsics.filter(id => id !== asicId));
  };
  const handleRemoveEquipment = (equipmentId: string) => {
    setSelectedEquipment(selectedEquipment.filter(id => id !== equipmentId));
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Site Selection */}
          <div className="space-y-2">
            <Label htmlFor="site" className="text-sm font-medium">
              Site <span className="text-red-500">*</span>
            </Label>
            <Select value={site} onValueChange={setSite} required>
              <SelectTrigger id="site" className="w-full">
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map(site => <SelectItem key={site.id} value={site.id.toString()}>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(site.status)}`} />
                      {site.name}
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="report-type" className="text-sm font-medium">
              Report Type <span className="text-red-500">*</span>
            </Label>
            <Select value={reportType} onValueChange={setReportType} required>
              <SelectTrigger id="report-type" className="w-full">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily_operational">
                  Daily Operational Summary
                </SelectItem>
                <SelectItem value="incident">Incident Report</SelectItem>
                <SelectItem value="maintenance">Maintenance Log</SelectItem>
                <SelectItem value="safety">Safety Observation</SelectItem>
                <SelectItem value="equipment">Equipment Check</SelectItem>
                <SelectItem value="security">Security Update</SelectItem>
                <SelectItem value="visitor">Visitor Log</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Report Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Report Title/Summary <span className="text-red-500">*</span>
            </Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Enter report title or summary" />
          </div>
          {/* Report Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Report Date{' '}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          {/* Report Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Report Content <span className="text-red-500">*</span>
            </Label>
            <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} required placeholder="Enter detailed report content" className="min-h-[200px] resize-y" />
          </div>
        </div>
      </div>

      {/* Advanced Details Toggle Button */}
      <div className="pt-2 pb-4">
        <Button type="button" variant="outline" onClick={toggleAdvancedDetails} className="w-full flex items-center justify-center gap-2">
          {showAdvancedDetails ? <>
              <ChevronUp className="h-4 w-4" />
              Hide Advanced Details
            </> : <>
              <ChevronDown className="h-4 w-4" />
              Show Advanced Details
            </>}
        </Button>
        <div className="flex items-center justify-end mt-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Switch id="save-preference" checked={saveViewPreference} onCheckedChange={setSaveViewPreference} />
            <Label htmlFor="save-preference" className="cursor-pointer">
              Remember my preference
            </Label>
          </div>
        </div>
      </div>

      {/* Advanced Details Section */}
      {showAdvancedDetails && <div className="border rounded-md p-4 space-y-6 bg-muted/20">
          <h3 className="text-md font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Related ASICs */}
            <div className="space-y-2">
              <Label htmlFor="asics" className="text-sm font-medium">
                Related ASICs{' '}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Select onValueChange={value => {
            if (!selectedAsics.includes(value)) {
              setSelectedAsics([...selectedAsics, value]);
            }
          }}>
                <SelectTrigger id="asics" className="w-full">
                  <SelectValue placeholder="Select ASICs" />
                </SelectTrigger>
                <SelectContent>
                  {asics.map(asic => <SelectItem key={asic.id} value={asic.id.toString()} disabled={selectedAsics.includes(asic.id.toString())}>
                      {asic.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAsics.map(asicId => {
              const asic = asics.find(a => a.id.toString() === asicId);
              return <Badge key={asicId} variant="secondary" className="flex items-center gap-1">
                      {asic?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveAsic(asicId)} />
                    </Badge>;
            })}
              </div>
            </div>
            {/* Related Equipment */}
            <div className="space-y-2">
              <Label htmlFor="equipment" className="text-sm font-medium">
                Related Equipment{' '}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Select onValueChange={value => {
            if (!selectedEquipment.includes(value)) {
              setSelectedEquipment([...selectedEquipment, value]);
            }
          }}>
                <SelectTrigger id="equipment" className="w-full">
                  <SelectValue placeholder="Select Equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map(item => <SelectItem key={item.id} value={item.id.toString()} disabled={selectedEquipment.includes(item.id.toString())}>
                      {item.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEquipment.map(equipId => {
              const equip = equipment.find(e => e.id.toString() === equipId);
              return <Badge key={equipId} variant="secondary" className="flex items-center gap-1">
                      {equip?.name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveEquipment(equipId)} />
                    </Badge>;
            })}
              </div>
            </div>
          </div>
        </div>}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </form>;
}