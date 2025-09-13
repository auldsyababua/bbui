import React, { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { GripVertical, X, Edit, Check } from 'lucide-react';
interface ListItemProps {
  item: {
    id: string;
    text: string;
    checked?: boolean;
  };
  index: number;
  onCheck: (checked: boolean) => void;
  onDelete: () => void;
}
export function ListItem({
  item,
  index,
  onCheck,
  onDelete
}: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const handleEdit = () => {
    setIsEditing(true);
    setEditText(item.text);
  };
  const handleSave = () => {
    // In a real app, you'd update the item text here
    console.log(`Updating item ${item.id} text to: ${editText}`);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditText(item.text);
  };
  return <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md group">
      <div className="cursor-move text-muted-foreground">
        <GripVertical className="h-5 w-5" />
      </div>
      <Checkbox checked={item.checked} onCheckedChange={onCheck} className="h-5 w-5" />
      {isEditing ? <div className="flex-1 flex items-center gap-2">
          <input type="text" value={editText} onChange={e => setEditText(e.target.value)} className="flex-1 bg-background border rounded-md px-2 py-1 text-sm" autoFocus />
          <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleSave}>
            <Check className="h-4 w-4 text-green-600" />
            <span className="sr-only">Save</span>
          </Button>
          <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleCancel}>
            <X className="h-4 w-4 text-red-600" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div> : <>
          <span className={`flex-1 text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
            {item.text}
          </span>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleEdit}>
              <Edit className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onDelete}>
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </>}
    </div>;
}