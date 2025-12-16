# Magic Patterns UI Design Prompt for FLRTS System

## Project Overview
Create a comprehensive UI for FLRTS (Field Reports, Lists, Reminders, Tasks & Subtasks) - an operational management platform for distributed field teams. Use shadcn/ui components with IBM Plex Sans font. Modern, clean, high contrast design with minimal distractions and no multi-layered menus.

## Key Design Principles
- Mobile-first responsive design
- Natural language input throughout
- High contrast black text on white backgrounds
- Single-level navigation (no dropdowns)
- 48px minimum touch targets
- Voice input buttons prominent

## 1. Main Dashboard (/)

### TopNav
- Left: Logo "10NetZero"
- Right: Tools button | Settings button | User avatar with dropdown (Profile, Settings, Logout)

### App Grid (3 columns desktop, 2 mobile)
Create cards for each app with:
- Icon (top left, 48x48, primary color background)
- Title (18px semibold)
- Description (14px, 2 lines max)
- Hover: subtle shadow
- Disabled state: 60% opacity

Apps to create:
- **Brain Bot**: Brain icon, "AI assistant for operations"
- **FLRTS**: FileText icon with 2x2 quick links grid inside card:
  - Field Reports → /field-reports
  - Tasks & Reminders → /tasks-and-reminders  
  - Lists → /lists
- **Markup Manager**: Calculator icon, "Coming Soon" badge
- **Analytics**: BarChart icon
- **Investor Portal**: Users icon
- **Doc Viewer**: FileSearch icon
- **Personnel**: Users icon
- **Sites**: MapPin icon
- **Settings**: Settings icon

## 2. Brain Bot Chat (/brain-bot)

### Header
Show: Status dot | "Brain Bot" | Model dropdown | Context chip | Settings icon

### Message Area
- User messages: Right aligned, gray bubble
- Bot messages: Left aligned with avatar, white bubble
- System notices: Centered, muted text
- Loading: Three dots animation

### Input Area
- Expanding textarea (1-5 rows)
- Bottom toolbar: Attach | Voice | Commands (/) | Send button
- Character count after 500 chars

### Quick Actions Bar
Chips above input: "Today's Summary" | "Open Tasks" | "Recent Reports"

## 3. Task Manager (/tasks)

### Natural Language Input
Large textarea: "Tell Bryan to check generator oil at Eagle Lake tomorrow at 3pm"
Below: Mic button | Examples dropdown

### Parsed Preview Card
Show extracted: Assignee (with avatar) | Task | Location | Due date/time | Priority
Actions: Edit Details | Confirm & Save | Cancel

### Task List
Group by: Overdue (red) | Today | Tomorrow | This Week | Next Week

### Task Cards
Show: Avatar | Name | Task description | Location | Due time
Actions: Complete | Add Note | Reassign | More
Status borders: Red=overdue, Yellow=due soon, Green=complete

### Filters Bar
Search box | Quick filters: My Tasks | All | Overdue | Today
Advanced: Assignee, Site, Status, Priority dropdowns

## 4. Field Reports (/field-reports)

### Quick Create
3 large buttons: Voice Report (mic icon) | Photo Report (camera icon) | Text Report (pencil icon)

### Report Form
- Site dropdown (required)
- Report type buttons: Routine | Issue | Maintenance | Incident
- Title input
- Description textarea
- Severity radio (if Issue/Incident): Low | Medium | High | Critical
- Attachments: Drag-drop zone

### Report List
Filter tabs: All | My Reports | Issues | Today

### Report Cards
Badge (type) | Title | Priority indicator
Location | Reporter | Time ago
Preview text (2 lines)
Attachment count
Actions: View | Create Task | Resolve

## 5. Lists (/lists)

### Create List
- Name input
- Type selector with icons: Checklist | Inventory | Shopping | Maintenance | Safety | Equipment | Contacts | Procedure
- Site dropdown (optional)

### List Items
- Checkbox | Item text | Quantity (if applicable)
- Drag handle for reordering
- Add item: Plus button at bottom
- Bulk add: "Paste items" button

## 6. Investor Dashboard Builder (/investor-portal)

### Partner List Table
Columns: Name | Type | Contact | Sites | Markup % | Status
Actions per row: Edit | View Dashboard | Manage Access

### Dashboard Builder
Left panel: Widget library (Metrics, Charts, Tables, Maps)
Center: 12-column grid canvas with snap-to-grid
Right panel: Widget configuration when selected

### Widgets Available
- **Metric Card**: Number, trend arrow, sparkline
- **Chart**: Line, Bar, Pie options
- **Table**: Sortable, filterable data grid
- **Map**: Sites with status indicators

## 7. Forms (Create modals/sheets)

### Field Report Form
Fields: Site* | Date* | Type* | Title* | Content* | Weather | Issues found toggle | Follow-up toggle | Parts used | Hours | Files

### Task Form  
Fields: Title* | Description | Assignee | Site | Due date | Priority (Low/Med/High) | Tags

### Reminder Form
Fields: Title* | DateTime* | Remind who* | Related task | Related site | Channels (Telegram/Email/SMS) | Recurrence

### List Form
Fields: Name* | Type* | Site | Description | Items array | Due date | Assigned to

## Mobile Patterns
- Bottom sheet for forms (90vh height)
- Bottom navigation: Home | Create (+) | Profile
- Swipe right to complete tasks
- Voice input button prominent in all inputs
- Full-width cards with 16px padding

## Style Specifications
- Font: IBM Plex Sans (400, 500, 600, 700)
- Colors: 
  - Primary: #1890ff
  - Success: #52c41a  
  - Warning: #faad14
  - Danger: #ff4d4f
  - Borders: #eeeeee
- Spacing: 8px base (4, 8, 16, 24, 32, 48)
- Border radius: 6px
- Shadows: Minimal (0-2px)
- All buttons: 44px min height
- All inputs: 44px min height, 1px border

## Component Naming
Format: [Feature]_[Component]_[Variant]
Examples: TaskInput_Natural, ChatMessage_User, ReportCard_Summary