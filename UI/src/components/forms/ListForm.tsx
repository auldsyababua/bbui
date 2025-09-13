import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Plus, X, GripVertical, CheckSquare, Package, ShoppingCart, Wrench, AlertTriangle, Settings, Users, ClipboardList } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
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
const listTypes = [{
  id: 'tools_inventory',
  name: 'Tools Inventory',
  icon: Wrench
}, {
  id: 'shopping_list',
  name: 'Shopping List',
  icon: ShoppingCart
}, {
  id: 'master_task',
  name: 'Master Task List',
  icon: CheckSquare
}, {
  id: 'safety_checklist',
  name: 'Safety Checklist',
  icon: AlertTriangle
}, {
  id: 'maintenance_procedure',
  name: 'Maintenance Procedure',
  icon: Settings
}, {
  id: 'contact_list',
  name: 'Contact List',
  icon: Users
}, {
  id: 'other',
  name: 'Other',
  icon: ClipboardList
}];
export function ListForm() {
  const [name, setName] = useState('');
  const [listType, setListType] = useState('');
  const [site, setSite] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('active');
  const [isMasterSOP, setIsMasterSOP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<any[]>([{
    id: '1',
    text: 'Check generator oil levels',
    checked: false
  }, {
    id: '2',
    text: 'Inspect cooling system',
    checked: false
  }]);
  const [newItemText, setNewItemText] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      alert('List created successfully');
    }, 1500);
  };
  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: newItemText,
        checked: false
      };
      setItems([...items, newItem]);
      setNewItemText('');
    }
  };
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
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
  return <form onSubmit={handleSubmit} className="space-y-6">
      {/* List Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          List Name <span className="text-red-500">*</span>
        </Label>
        <Input id="name" value={name} onChange={e => setName(e.target.value)} maxLength={255} required placeholder="Enter list name" />
      </div>
      {/* Site */}
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
                {site.name}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter list description" maxLength={150} required className="resize-none" />
        <div className="text-xs text-muted-foreground text-right">
          {description.length}/150
        </div>
      </div>
      {/* List Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">List Type</Label>
        <RadioGroup value={listType} onValueChange={setListType} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {listTypes.map(type => {
          const Icon = type.icon;
          return <div key={type.id} className="relative">
                <RadioGroupItem value={type.id} id={type.id} className="absolute inset-0 opacity-0" />
                <Label htmlFor={type.id} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 gap-2 cursor-pointer hover:bg-muted transition-colors ${listType === type.id ? 'border-primary bg-primary/5' : ''}`}>
                  <Icon className="h-8 w-8" />
                  <span className="text-sm font-medium text-center">
                    {type.name}
                  </span>
                </Label>
              </div>;
        })}
        </RadioGroup>
      </div>
      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium">
          Status
        </Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Owner */}
      <div className="space-y-2">
        <Label htmlFor="owner" className="text-sm font-medium">
          Owner
        </Label>
        <Select value={owner} onValueChange={setOwner}>
          <SelectTrigger id="owner" className="w-full">
            <SelectValue placeholder="Select owner (optional)" />
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
      {/* Master SOP List */}
      <div className="flex items-center space-x-2">
        <Checkbox id="master-sop" checked={isMasterSOP} onCheckedChange={checked => setIsMasterSOP(checked as boolean)} />
        <Label htmlFor="master-sop" className="text-sm font-medium">
          Is Master SOP List
        </Label>
      </div>
      {/* List Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">List Items</Label>
        </div>
        <div className="space-y-2 border rounded-lg p-4">
          {items.length > 0 ? <div className="space-y-2 mb-4">
              {items.map((item, index) => <div key={item.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-md group">
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <span className="flex-1">{item.text}</span>
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveItem(item.id)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>)}
            </div> : <div className="text-center py-8 text-muted-foreground">
              No items yet. Add your first item below.
            </div>}
          <div className="flex items-center gap-2">
            <Input value={newItemText} onChange={e => setNewItemText(e.target.value)} placeholder="Add new item" className="flex-1" />
            <Button type="button" size="sm" onClick={handleAddItem} disabled={!newItemText.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create List'}
        </Button>
      </div>
    </form>;
}