# Implement FLRTS Items Creation UI

## Context
You need to create a comprehensive UI for managing FLRTS (Field Reports, Lists, Reminders, Tasks & Subtasks) items in the Supabase database. The UI should leverage Refine's data provider capabilities and Ant Design components for a professional, consistent interface.

## Current State
- The app uses Refine with Ant Design for UI components
- Supabase is configured as the data provider with real-time support
- Authentication is implemented using Supabase Auth
- The app structure follows Refine's resource-based routing

## Database Schema Reference
Refer to the FLRTS tables in Supabase:
- `tasks` - Core task management
- `field_reports` - Field operation reports
- `lists` and `list_items` - Checklists and inventory
- `reminders` - Time-based alerts
- `notifications_log` - Activity tracking

## Implementation Requirements

### 1. Create Task Management UI

#### Natural Language Input Component
```typescript
// src/components/tasks/NaturalLanguageInput.tsx
- Large textarea with microphone button
- Live preview panel showing parsed task data
- Visual feedback during parsing
- Error handling for ambiguous input
- Quick action buttons (Today, Tomorrow, High Priority)
```

#### Task List View
```typescript
// src/pages/tasks/list.tsx
- Kanban board view with drag-and-drop
- Table view with advanced filtering
- Calendar view for scheduling
- Quick filters: "My Tasks", "Overdue", "This Week"
- Bulk actions toolbar
- Export functionality
```

#### Task Create/Edit Form
```typescript
// src/pages/tasks/create.tsx & edit.tsx
- Smart form that adapts based on task type
- Assignee picker with avatar display
- Location autocomplete from sites table
- Date/time picker with natural language support
- Priority indicator with color coding
- Subtask management interface
- File attachment support
```

### 2. Field Reports Interface

#### Report Creation Flow
```typescript
// src/pages/reports/create.tsx
- Multi-step wizard:
  1. Select site/equipment
  2. Choose report type (incident, maintenance, inspection)
  3. Add details (voice recording option)
  4. Attach photos with annotations
  5. Review and submit
- Offline queue indicator
- GPS location auto-capture
```

#### Report List View
```typescript
// src/pages/reports/list.tsx
- Timeline view by default
- Map view showing report locations
- Filter by: site, technician, date range, type
- Severity indicators (critical, warning, info)
- Quick view modal with images
- Export to PDF functionality
```

### 3. Lists & Checklists UI

#### List Templates
```typescript
// src/pages/lists/templates.tsx
- Pre-built maintenance checklists
- Equipment-specific lists
- Safety inspection templates
- Drag-and-drop template builder
- Version control for templates
```

#### Interactive Checklist
```typescript
// src/components/lists/InteractiveChecklist.tsx
- Touch-friendly checkboxes
- Progress indicator
- Notes per item
- Photo attachment per item
- Signature capture
- Timestamp tracking
```

### 4. Reminders & Notifications

#### Reminder Creation
```typescript
// src/components/reminders/ReminderForm.tsx
- Natural language input: "Remind Bryan about oil change in 3 months"
- Recurrence patterns (daily, weekly, monthly, custom)
- Multiple notification channels (in-app, email, SMS, Telegram)
- Snooze and reschedule options
```

#### Notification Center
```typescript
// src/components/NotificationCenter.tsx
- Dropdown panel in header
- Grouped by type and urgency
- Mark as read/unread
- Quick actions from notification
- Settings for notification preferences
```

### 5. Shared Components

#### Resource Selector
```typescript
// src/components/shared/ResourceSelector.tsx
- Universal picker for sites, equipment, personnel
- Search with fuzzy matching
- Recent selections
- Hierarchical display (Site > Equipment)
```

#### DateTime Picker
```typescript
// src/components/shared/SmartDatePicker.tsx
- Natural language parsing: "next Tuesday", "in 2 hours"
- Quick presets: Now, Today, Tomorrow, Next Week
- Timezone awareness
- Relative time display
```

#### File Upload
```typescript
// src/components/shared/FileUpload.tsx
- Drag-and-drop zone
- Image preview and annotation
- Compression for mobile uploads
- Progress indicator
- Retry failed uploads
```

### 6. Mobile Responsiveness

- Touch-optimized controls (minimum 44px touch targets)
- Swipe gestures for common actions
- Bottom sheet pattern for forms
- Collapsible sections to save space
- Offline indicator in header
- Pull-to-refresh on lists

### 7. Real-time Features

```typescript
// Use Refine's liveProvider
- Live task updates
- Presence indicators (who's viewing what)
- Typing indicators in forms
- Conflict resolution for simultaneous edits
- Toast notifications for changes
```

### 8. Integration Points

#### GPT Parser Integration
```typescript
// src/services/gptParser.ts
interface ParsedTask {
  assignee: string;
  action: string;
  location?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
}

// Hook for natural language parsing
const useTaskParser = (input: string) => {
  // Debounced API call to parser
  // Return parsed data and confidence score
  // Handle loading and error states
};
```

#### Supabase Realtime
```typescript
// Already configured in App.tsx
liveProvider={liveProvider(supabaseClient)}

// Use in components:
const { data, isLoading } = useList({
  resource: "tasks",
  liveMode: "auto", // Enable real-time updates
  subscribeToList: true,
});
```

### 9. Access Control

```typescript
// Use Refine's accessControlProvider
- Role-based UI elements
- Hide/show features based on permissions
- Disable actions for read-only users
- Admin-only sections
```

### 10. Performance Optimizations

- Virtual scrolling for long lists
- Lazy loading for images
- Debounced search inputs
- Optimistic UI updates
- Service worker for offline support
- IndexedDB for local data cache

## File Structure

```
src/
├── pages/
│   ├── tasks/
│   │   ├── list.tsx
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   └── show.tsx
│   ├── reports/
│   │   ├── list.tsx
│   │   ├── create.tsx
│   │   └── show.tsx
│   ├── lists/
│   │   ├── list.tsx
│   │   ├── templates.tsx
│   │   └── execute.tsx
│   └── reminders/
│       ├── list.tsx
│       └── create.tsx
├── components/
│   ├── tasks/
│   │   ├── NaturalLanguageInput.tsx
│   │   ├── TaskCard.tsx
│   │   └── KanbanBoard.tsx
│   ├── reports/
│   │   ├── ReportWizard.tsx
│   │   └── PhotoAnnotator.tsx
│   ├── lists/
│   │   ├── InteractiveChecklist.tsx
│   │   └── TemplateBuilder.tsx
│   ├── shared/
│   │   ├── ResourceSelector.tsx
│   │   ├── SmartDatePicker.tsx
│   │   └── FileUpload.tsx
│   └── NotificationCenter.tsx
├── services/
│   ├── gptParser.ts
│   └── offlineQueue.ts
└── hooks/
    ├── useTaskParser.ts
    ├── useOfflineSync.ts
    └── useNotifications.ts
```

## Implementation Steps

1. **Start with Tasks Module**
   - Create the natural language input component
   - Implement basic CRUD pages using Refine generators
   - Add the Kanban view
   - Integrate GPT parser service

2. **Add Field Reports**
   - Build the multi-step wizard
   - Implement photo capture and annotation
   - Add map view for reports

3. **Implement Lists & Checklists**
   - Create template management
   - Build interactive checklist component
   - Add progress tracking

4. **Setup Notifications**
   - Build notification center UI
   - Implement reminder creation
   - Add real-time updates

5. **Mobile Optimization**
   - Test on various devices
   - Implement touch gestures
   - Add offline support

6. **Polish & Integration**
   - Add loading states
   - Implement error boundaries
   - Setup analytics tracking
   - Performance optimization

## Key Considerations

1. **User Experience**
   - Field technicians work in challenging conditions
   - Minimize typing, maximize voice/selection
   - Clear visual feedback for all actions
   - Fast load times on slow connections

2. **Data Integrity**
   - Validate all inputs before submission
   - Handle conflicts in real-time updates
   - Maintain audit trail for all changes
   - Implement soft deletes

3. **Offline Support**
   - Queue actions when offline
   - Sync when connection returns
   - Show clear offline indicators
   - Prevent data loss

4. **Accessibility**
   - ARIA labels for all interactive elements
   - Keyboard navigation support
   - High contrast mode option
   - Screen reader compatibility

## Testing Checklist

- [ ] Natural language input parses common phrases correctly
- [ ] Drag-and-drop works on mobile devices
- [ ] Offline mode queues actions properly
- [ ] Real-time updates appear within 2 seconds
- [ ] Forms validate and show helpful errors
- [ ] File uploads work with large images
- [ ] Navigation is intuitive and consistent
- [ ] Performance remains smooth with 1000+ items
- [ ] Access control hides restricted features
- [ ] Mobile UI is touch-friendly

## Success Criteria

1. **Speed**: Tasks can be created in under 30 seconds
2. **Accuracy**: Natural language parser has >90% accuracy
3. **Reliability**: Offline mode never loses data
4. **Usability**: Field techs can use with gloves on
5. **Performance**: Lists load in under 2 seconds

---

Remember: The UI should be intuitive enough that field technicians can use it without training, while being powerful enough for managers to get deep insights into operations.