# Magic Patterns UI Design Prompt for FLRTS System - SHADCN/UI IMPLEMENTATION

## Project Overview
Create a comprehensive UI design system for FLRTS (Field Reports, Lists, Reminders, Tasks & Subtasks) - an operational management platform for distributed field teams managing bitcoin mining and energy infrastructure. The system should support natural language input, real-time collaboration, and intelligent automation.

## Technology Stack
- **Component Library**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React (built into shadcn)
- **Forms**: React Hook Form + Zod (shadcn Form component)
- **State**: Zustand or React Context
- **Data Fetching**: TanStack Query (React Query)

## Critical Implementation Notes

### Database Schema Reference
The system uses these key Supabase tables:
- **personnel**: All users (id, first_name, last_name, email, phone_number, job_title, personnel_type, primary_site_id, app_role, flrts_permissions)
- **partners**: Investors/stakeholders (id, partner_name, partner_type, primary_contact_*, is_active)
- **site_partner_assignments**: Links partners to sites (site_id, partner_id, role_of_partner_at_site, markup_percentage)
- **sites**: Operational locations (id, site_name, site_address_*, site_status, operator_id)
- **brain_bot_documents**: Knowledge base documents
- **flrts_tasks**: Task management (coming soon)
- **flrts_reports**: Field reports (coming soon)

### User Roles & Permissions
- **Admin** (app_role='admin'): Full system access, can manage all data
- **User** (app_role='user'): Can create/edit tasks, reports, lists
- **Viewer** (app_role='viewer'): Read-only access to assigned data
- **Partner** (external): Custom dashboard access via secure links

### Authentication Flow
1. User signs in with Google OAuth (@10netzero.com emails)
2. System creates/updates personnel record
3. Permissions loaded from personnel.app_role + flrts_permissions JSONB
4. Partners access via token-based URLs (no Google auth required)

## Design Philosophy
- **Low-friction data entry**: Minimize clicks and typing
- **Natural language first**: Voice and text input throughout
- **Mobile-first**: Field technicians use phones/tablets primarily
- **Context-aware**: Smart defaults based on user role, location, time
- **Progressive disclosure**: Show complexity only when needed

## Component Requirements

### 1. App Dashboard with Navigation (AppDashboard)
**Purpose**: Main landing page with top navigation and app grid

**TopNav_Main - shadcn implementation**:
```tsx
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Wrench, Settings, LogOut, User, ChevronDown } from "lucide-react"

<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-14 max-w-screen-2xl items-center">
    {/* Left side - Logo/Home */}
    <div className="mr-4 flex">
      <a href="/" className="mr-6 flex items-center space-x-2">
        <span className="font-bold">10NetZero</span>
      </a>
    </div>

    {/* Center - Navigation (optional, can be removed for single-layer nav) */}
    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      <nav className="flex items-center space-x-6">
        <Button variant="ghost" size="sm" className="h-9">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </nav>

      {/* Right side - Tools, Settings, Profile */}
      <div className="flex items-center space-x-4">
        {/* Tools Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9">
              <Wrench className="mr-2 h-4 w-4" />
              Tools
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Export Reports
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Database className="mr-2 h-4 w-4" />
              Backup Data
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download Logs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Terminal className="mr-2 h-4 w-4" />
              Developer Console
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings Button */}
        <Button variant="ghost" size="sm" className="h-9" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</header>
```

**TopNav_Mobile - Responsive version**:
```tsx
// Mobile navigation with sheet menu
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur md:hidden">
  <div className="container flex h-14 items-center">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] sm:w-[385px]">
        <nav className="flex flex-col space-y-4">
          <a href="/" className="flex items-center space-x-2 text-lg font-semibold">
            10NetZero
          </a>
          <Separator />
          <Button variant="ghost" className="justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground px-2">Tools</h4>
            <Button variant="ghost" className="justify-start w-full">
              <FileText className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
            <Button variant="ghost" className="justify-start w-full">
              <Database className="mr-2 h-4 w-4" />
              Backup Data
            </Button>
          </div>
          <Separator />
          <Button variant="ghost" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Separator />
          <Button variant="ghost" className="justify-start text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
    
    <div className="flex-1 text-center">
      <span className="font-semibold">10NetZero</span>
    </div>
    
    <Avatar className="h-8 w-8">
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  </div>
</header>
```

**Main Dashboard Layout**:
```tsx
// Full page layout with navigation
<div className="flex min-h-screen flex-col">
  {/* Top Navigation */}
  <TopNav_Main />
  
  {/* Main Content */}
  <main className="flex-1">
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Apps</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.id} {...app} />
        ))}
      </div>
    </div>
  </main>
</div>
```

**AppCard Component using shadcn Card**:
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, ClipboardList, FileText, Calculator, BarChart, Users, Settings } from "lucide-react"

// Each card follows this pattern:
<Card className={cn(
  "relative overflow-hidden transition-all hover:shadow-lg",
  app.disabled && "opacity-60 cursor-not-allowed"
)}>
  <CardHeader>
    <div className="flex items-start justify-between">
      <div className="p-2 w-12 h-12 rounded-lg bg-primary/10 text-primary">
        <Brain className="w-8 h-8" />
      </div>
      {app.comingSoon && (
        <Badge variant="secondary">Coming Soon</Badge>
      )}
    </div>
    <CardTitle className="mt-4">{app.title}</CardTitle>
    <CardDescription className="line-clamp-2">
      {app.description}
    </CardDescription>
  </CardHeader>
</Card>
```

**App configurations**:
- AppCard_BrainBot: Brain icon, Beta badge, blue accent
- AppCard_TaskManager: ClipboardList icon, active state
- AppCard_FieldReports: FileText icon, active state
- AppCard_ListManager: List icon, active state
- AppCard_DocViewer: FileSearch icon, active state
- AppCard_MarkupManager: Calculator icon, "Coming Soon" badge
- AppCard_Analytics: BarChart3 icon, active state
- AppCard_InvestorPortal: Users icon, active state
- AppCard_Settings: Settings icon, active state

### 2. Brain Bot Chat Interface (BrainBotChat)
**Purpose**: AI-powered conversational interface for intelligent assistance
**Components**:

#### 2.1 Chat Header (ChatHeader)

**ChatHeader_BrainBot**
- Shows status, model selection, context, and settings
- Status indicator:
  - Green dot: Online/Ready
  - Yellow dot: Processing
  - Red dot: Offline/Error
- Model selector (dropdown):
  - GPT-4 (Default)
  - GPT-3.5 (Faster)
  - Claude 3 (Available soon)
- Context chip shows:
  - Current site (if selected)
  - "All Sites" (default)
  - Click to change context

**ChatHeader_Settings**
- Opens modal with:
  - Response style: Concise | Detailed | Technical
  - Auto-suggestions: On/Off
  - Voice responses: On/Off
  - Clear chat history option
  - Export chat option

#### 2.2 Message Display (ChatMessages)

**ChatMessageList_BrainBot**
- Scrollable container (auto-scroll on new messages)
- Message grouping by time (5+ min gap shows timestamp)
- Load more button at top (infinite scroll)
- Empty state: "Ask me anything about your operations..."

**ChatMessage_User**
```
                                    [You] 3:42 PM
          Can you summarize today's field reports
          from Eagle Lake?
                                    [Copy] [Edit]
```

**ChatMessage_Bot**
```
[🧠] Brain Bot                           3:42 PM
Here's today's summary for Eagle Lake:

**3 Field Reports:**
1. ✅ Morning inspection - All systems normal
2. ⚠️ Generator 2 - Minor oil leak detected
3. ✅ Solar panel cleaning completed

**Action Required:**
- Generator 2 needs follow-up maintenance

[Create Task] [View Reports] [Copy]
                          👍 👎 [Report Issue]
```

**ChatMessage_Loading**
- Three dots animation
- "Brain Bot is thinking..." text
- Cancel button (for long operations)

**ChatMessage_Error**
```
❌ Unable to process request
"Connection timeout - please try again"
[Retry] [Report Issue]
```

**ChatMessage_SystemNotice**
```
📢 System: You're now viewing Eagle Lake data only
```

#### 2.3 Input Area (ChatInput)

**ChatInput_BrainBot**
- Expanding textarea (1-5 rows)
- Placeholder: "Ask about tasks, reports, or operations..."
- Character count (shows after 500 chars)
- Bottom toolbar:
  ```
  [📎] [🎤] [/]  Type your message...  [Send →]
   File  Voice Commands
  ```

**ChatInput_Voice**
- Hold to talk interface
- Real-time transcription preview
- Language detection
- Noise cancellation indicator

**ChatInput_Commands**
- "/" triggers command palette with task, report, search, summary, help

**ChatInput_Attachments**
- Drag & drop zone appears when dragging
- Supported: Images, PDFs, CSVs, Text files
- Preview thumbnails before sending
- Progress bar during upload

#### 2.4 Quick Actions (ChatQuickActions)

**ChatQuickActions_BrainBot**
- Collapsible quick action bar with context-sensitive suggestions
- Shows relevant actions based on time, location, and conversation

**ChatQuickActions_Templates**
- Quick buttons for common queries (tasks due, issues, reports, docs)

#### 2.5 Context & Intelligence (ChatContext)

**ChatContextIndicator_BrainBot**
- Shows current site, user role, and date range with change option

**ChatContext_Selector**
- Modal with tabs:
  - Sites: Checkbox list of sites
  - People: View as specific person
  - Time: Date range picker
  - Data: Include/exclude data types

**ChatContext_Memory**
- "Brain Bot remembers:" section
- Recent context from conversation
- Clear memory option

#### 2.6 Rich Responses (ChatRichContent)

**ChatResponse_Table**
```
| Task | Assignee | Due | Status |
|------|----------|-----|--------|
| Check generator | Bryan | Today 3pm | Pending |
| Clean panels | Joel | Tomorrow | Complete |

[Export CSV] [Create Tasks]
```

**ChatResponse_Chart**
- Inline charts (Chart.js)
- Interactive tooltips
- Download as image option

**ChatResponse_ActionCards**
```
I found 3 options for you:

[📋 Create Task]    [📝 File Report]    [🔍 Search More]
 "Check generator"   "At Eagle Lake"     "Similar issues"
```

**ChatResponse_CodeBlock**
```python
# Equipment maintenance schedule
schedule = {
    "generator": "monthly",
    "panels": "quarterly",
    "batteries": "annual"
}
```
[Copy Code] [Run Analysis]

#### 2.7 Mobile Optimizations

**ChatMobile_InputBar**
- Fixed bottom position
- Larger touch targets
- Voice button prominent
- Swipe up for attachments

**ChatMobile_QuickReplies**
- Horizontal scroll chips:
  ```
  [Yes] [No] [Show more] [Create task] [Later]
  ```

**ChatMobile_Gestures**
- Swipe message left: Quick actions
- Long press: Copy/Share
- Pull down: Refresh
- Double tap: Toggle voice

### 3. Task Management (TaskManager)
**Purpose**: Natural language task creation and management
**Components**:

#### 3.1 Task Creation Interface (TaskCreate)

**TaskInput_Natural - shadcn implementation**:
```tsx
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Mic, ChevronDown } from "lucide-react"

<Card className="p-6">
  <div className="relative">
    <Textarea
      placeholder="Tell Bryan to check generator oil at Eagle Lake tomorrow at 3pm"
      className="min-h-[120px] pr-16 text-base resize-none"
      onChange={handleParse}
    />
    <Button
      size="icon"
      variant="ghost"
      className="absolute right-2 bottom-2"
      onClick={startVoiceInput}
    >
      <Mic className="h-5 w-5" />
    </Button>
    <span className="absolute right-2 top-2 text-xs text-muted-foreground">
      {charCount}/500
    </span>
  </div>
  
  <Collapsible className="mt-4">
    <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <ChevronDown className="h-4 w-4" />
      Show examples
    </CollapsibleTrigger>
    <CollapsibleContent className="mt-2 space-y-2">
      {examples.map((example) => (
        <button
          key={example}
          className="block w-full text-left p-3 rounded-md bg-muted/50 hover:bg-muted text-sm"
          onClick={() => setInput(example)}
        >
          {example}
        </button>
      ))}
    </CollapsibleContent>
  </Collapsible>
</Card>
```

**TaskParser_Preview - shadcn implementation**:
```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Clock, Bell, AlertCircle } from "lucide-react"

{parsedTask && (
  <Card className="mt-4 border-2 border-primary/20">
    <CardContent className="p-6 space-y-4">
      {/* Assignee */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={parsedTask.assignee.photo} />
          <AvatarFallback>{parsedTask.assignee.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{parsedTask.assignee.name}</p>
          <p className="text-sm text-muted-foreground">{parsedTask.assignee.role}</p>
        </div>
      </div>

      {/* Task description */}
      <div>
        <p className="font-medium">{parsedTask.description}</p>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{parsedTask.location || "No location"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{parsedTask.dueDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span>{parsedTask.reminder || "No reminder"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={parsedTask.priority === 'high' ? 'destructive' : 'secondary'}>
            {parsedTask.priority} priority
          </Badge>
        </div>
      </div>

      {/* Parsing warnings */}
      {parsedTask.warnings.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {parsedTask.warnings.map((warning, i) => (
              <span key={i} className="block">{warning}</span>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button onClick={handleEdit}>Edit Details</Button>
        <Button variant="default" onClick={handleSave}>
          Confirm & Save
        </Button>
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

**TaskParser_EditModal - shadcn Form implementation**:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

<Dialog open={editOpen} onOpenChange={setEditOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Edit Task Details</DialogTitle>
    </DialogHeader>
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Assignee with avatar preview */}
        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {personnel.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={person.photo} />
                          <AvatarFallback>{person.initials}</AvatarFallback>
                        </Avatar>
                        <span>{person.name}</span>
                        <span className="text-muted-foreground">({person.role})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Task Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="What needs to be done?" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Date and Time in grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          {/* Time Picker */}
          <FormField
            control={form.control}
            name="dueTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Priority Radio Group */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent">Urgent</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Save Task</Button>
        </div>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

**TaskCreate_Confirmation**
- Success toast: "Task created and assigned to Bryan"
- Options: [View Task] [Create Another] [Go to Tasks]

#### 3.2 Task List Views (TaskList)

**TaskList_Timeline**
- Grouped by date with headers:
  - "Overdue (3)" - Red header
  - "Today (5)" - Blue header  
  - "Tomorrow (2)"
  - "This Week (8)"
  - "Next Week (4)"
  
**TaskCard_Detailed**
- Layout:
  ```
  [Avatar] Bryan Johnson              [High Priority]
  Check generator oil levels and add if needed
  📍 Eagle Lake | ⏰ Today 3:00 PM
  
  [✓ Complete] [📝 Add Note] [🔄 Reassign] [⋮ More]
  ```
- Status indicators:
  - Overdue: Red border + icon
  - Due soon: Yellow border
  - Completed: Green check, strikethrough
  
**TaskList_TableView**
- Columns: Task | Assignee | Site | Due | Status | Priority | Actions
- Sortable headers
- Inline editing for status
- Checkbox selection for bulk actions
- Row actions: Complete | Edit | Delete

**TaskFilter_Smart**
- Filter bar (sticky top):
  - Search box: "Search tasks..."
  - Quick filters (pills):
    - [My Tasks] [All Tasks] [Overdue] [Today] [This Week]
  - Advanced filters (dropdown):
    - Assignee (multi-select personnel)
    - Site (multi-select sites)
    - Status (Todo, In Progress, Complete, Cancelled)
    - Priority (Low, Normal, High, Urgent)
    - Date range (preset + custom)
  - Sort by: Due Date | Priority | Assignee | Site
  - View toggle: Timeline | Table | Calendar

**TaskBulkActions**
- Shows when items selected:
  - "3 tasks selected"
  - Actions: [Reassign] [Change Priority] [Change Due Date] [Delete]
  
**TaskReassign_Modal**
- Current Assignee: Bryan Johnson
- New Assignee* (dropdown with availability indicator)
- Reason (optional textarea)
- Notify: □ Current assignee □ New assignee
- Actions: Reassign | Cancel

#### 3.3 Task Detail View (TaskDetail)

**TaskDetail_Header**
- Task title (editable inline)
- Status badge (dropdown to change)
- Priority indicator (clickable to change)
- Actions menu: Edit | Duplicate | Delete

**TaskDetail_Body**
- Assignee section:
  - Avatar + name
  - Phone/text buttons
  - Current location (if available)
  
- Details section:
  - Site/Location with map link
  - Due date/time (editable)
  - Created by + timestamp
  - Last modified
  
- Description (editable rich text)
  
- Subtasks:
  - □ Check oil level
  - □ Add oil if below minimum
  - □ Log reading in maintenance sheet
  - [+ Add subtask]

**TaskDetail_Activity**
- Timeline of all changes:
  - "Colin created task" - 2 hours ago
  - "Bryan accepted task" - 1 hour ago
  - "Bryan added note: 'Will check after lunch'" - 30 min ago
- Add comment box at bottom

**TaskDetail_Attachments**
- Uploaded files/images grid
- Drag-drop zone for new files
- Image preview on click

#### 3.4 Task Mobile Optimization

**TaskMobile_QuickCreate**
- Floating action button (+)
- Opens bottom sheet with:
  - Large voice button
  - Text input
  - Recent assignees (avatar row)
  
**TaskMobile_SwipeActions**
- Swipe right: Mark complete
- Swipe left: Reveal [Reassign] [Delete]
- Long press: Multi-select mode

**TaskMobile_DetailView**
- Full screen modal
- Collapsible sections
- Bottom action bar (sticky)

### 4. Field Reports (FieldReports)
**Purpose**: Quick field reporting with multimedia from the field
**Components**:

#### 4.1 Report Creation Interface (ReportCreate)

**ReportCreate_QuickAccess**
- Large card with 3 primary actions:
  ```
  [🎤 Voice Report]  [📸 Photo Report]  [✏️ Text Report]
      Hold to talk      Tap to capture     Type details
  ```

**ReportInput_Voice**
- Full screen overlay when activated
- Large pulsing red record button (center)
- Waveform visualization while recording
- Timer showing duration (MM:SS)
- Bottom controls:
  - [Pause] [Cancel] [Done]
- After recording:
  - Playback controls
  - [Re-record] [Add Details] [Submit]

**ReportInput_Text**
- Site selector (dropdown, auto-detected if possible)
- Report type quick select:
  - [Routine Check] [Issue Found] [Maintenance Complete] [Incident]
- Title* (text input): "Generator maintenance completed"
- Description* (expanding textarea)
- Severity (if Issue/Incident selected):
  - Radio: [Low] [Medium] [High] [Critical]
- Equipment involved (multi-select dropdown)
- Template snippets (expandable):
  - "All systems operational"
  - "Requires follow-up maintenance"
  - "Part replacement needed"

**ReportCamera_Quick**
- Native camera interface
- Toggle: Photo / Video
- After capture:
  - Image preview with annotation tools:
    - Draw arrows/circles
    - Add text labels
    - Highlight areas
  - Caption field below image
  - [Retake] [Add Another] [Continue]

**ReportLocation_Auto**
- Auto-detected location chip: "📍 Eagle Lake - Generator Building"
- [Change] link opens site/area selector
- If GPS available: Exact coordinates stored
- Manual override option

**ReportCategory_Smart**
- AI suggests based on content:
  - Suggested tags: [Maintenance] [Generator] [Oil Change]
  - Additional categories (dropdown)
  - Custom tags (type and press enter)

**ReportCreate_Summary**
- Before submission preview:
  ```
  Report Summary
  ─────────────
  Type: Maintenance Complete
  Site: Eagle Lake
  Title: Generator maintenance completed
  
  Description: Changed oil and filters on Generator 2...
  
  📎 Attachments: 3 photos, 1 voice note
  🏷️ Tags: Maintenance, Generator, Oil Change
  
  [Edit] [Save as Draft] [Submit Report]
  ```

#### 4.2 Report List Views (ReportList)

**ReportList_Recent**
- Filter tabs: [All] [My Reports] [My Sites] [Issues] [Today]
- Sort: Newest First | Oldest First | Priority | Site

**ReportCard_Summary**
```
[Issue] Generator 2 Oil Leak Found        [High Priority]
Eagle Lake | Bryan Johnson | 2 hours ago
"Noticed oil pooling under generator during morning..."
📎 3 photos · 🎤 2:34 voice note

[View Details] [Create Task] [Mark Resolved]
```

**ReportList_GroupedView**
- Group by options: Date | Site | Type | Reporter
- Collapsible sections with counts:
  - "Eagle Lake (12 reports)"
  - "Today (5 reports)"
  - "Critical Issues (2)"

**ReportFilter_Advanced**
- Date range picker
- Site (multi-select)
- Reporter (multi-select personnel)
- Type (checkboxes): Routine, Issue, Incident, Maintenance
- Severity: All, Critical, High, Medium, Low
- Has attachments (toggle)
- Keyword search

#### 4.3 Report Detail View (ReportDetail)

**ReportDetail_Header**
- Report type badge with color coding
- Site name and specific location
- Reporter avatar + name + timestamp
- Status: [Open] [In Progress] [Resolved]
- Actions: [Edit] [Create Task] [Export] [Share]

**ReportDetail_Content**
- Title (large font)
- Full description (formatted text)
- Media gallery:
  - Swipeable image carousel
  - Tap to zoom
  - Video player for video reports
- Voice note player:
  - Playback controls
  - AI transcription below (collapsible)

**ReportDetail_Metadata**
- Equipment involved (linked list)
- Categories/Tags (clickable chips)
- Weather at time (if relevant)
- GPS coordinates (map link)
- Related reports (if any)

**ReportDetail_Actions**
- Quick actions bar:
  - [Create Follow-up Task]
  - [Request More Info]
  - [Mark Resolved]
  - [Escalate]
  
**ReportDetail_Timeline**
- Activity feed:
  - "Bryan created report" - 3:00 PM
  - "Colin viewed report" - 3:15 PM
  - "Task created from report" - 3:20 PM
  - "Joel assigned to task" - 3:25 PM

**ReportDetail_Comments**
- Discussion thread
- @mention support
- Reply threading
- Attach files to comments

#### 4.4 Report Search & Analytics (ReportSearch)

**ReportSearch_Semantic**
- Natural language search box:
  - "Show me all generator issues from last month"
  - "Find reports about oil leaks"
  - "What problems did Bryan report at Eagle Lake?"
- Search suggestions as you type
- Recent searches saved

**ReportAnalytics_Dashboard**
- Metrics cards:
  - Total Reports This Month
  - Open Issues
  - Average Resolution Time
  - Most Reported Issues
- Charts:
  - Reports by Site (bar chart)
  - Issue Trends (line chart)
  - Reporter Activity (leaderboard)
  - Issue Categories (pie chart)

#### 4.5 Mobile Optimizations

**ReportMobile_QuickCapture**
- Camera button in navigation bar
- Shake to report (configurable)
- Offline mode with sync queue
- Compression for images/video

**ReportMobile_VoiceFirst**
- Hold tab bar to start voice report
- Background recording support
- Voice commands: "Submit report", "Add photo"

### 5. List Management (ListManager)
**Purpose**: Dynamic lists, checklists, inventory
**Components**:
- ListCreate_Natural: "Create a shopping list for Site A"
- ListItem_Checkable: Items with checkbox, quantity
- ListTemplate_Library: Common list templates
- ListInventory_Track: Track quantities and reorder points
- ListShare_Team: Share lists with team members
- ListHistory_Audit: Show who checked what when

### 6. Personnel Management (PersonnelManager)
**Purpose**: Team member profiles and assignments
**Components**:
- PersonnelCard_Overview: Photo, name, role, current site
- PersonnelSkills_Tags: Skillset tags ("Generator Expert")
- PersonnelAvailability_Calendar: Schedule view
- PersonnelContact_Quick: Call/text buttons
- PersonnelActivity_Recent: Recent tasks and reports
- PersonnelAssign_Smart: AI-suggested assignments

### 7. Site Management (SiteManager)
**Purpose**: Manage multiple operational sites
**Components**:
- SiteCard_Status: Site health indicator, active personnel
- SiteMap_Interactive: Map view of all sites
- SiteEquipment_List: Equipment at each site
- SiteReports_Recent: Latest field reports
- SiteTasks_Active: Open tasks for site
- SiteMetrics_Key: Power output, uptime, issues

### 8. Analytics Dashboard (AnalyticsDashboard)
**Purpose**: Operational insights and KPIs
**Components**:
- MetricCard_Realtime: Live operational metrics
- ChartTaskCompletion: Task completion rates
- ChartSiteUptime: Site availability charts
- MapHeatmap_Activity: Activity heatmap across sites
- TableTopIssues: Most common problems
- TimelineEvents: Critical events timeline

### 9. Investor Dashboard Builder (InvestorDashboards)
**Purpose**: Create custom dashboards for different investors/stakeholders with granular permissions

#### 9.1 Partner/Investor Management (PartnerManager)
**Components**:

**PartnerList_Table**
- Columns: Partner Name | Type | Primary Contact | Email | Phone | Active Sites | Markup % | Status
- Actions per row: Edit | View Dashboard | Manage Access | View Reports
- Bulk actions: Export list, Send bulk emails
- Search bar: Filter by name, type, or site
- Add button: "Add New Partner" (top right)

**PartnerCreate_Form**
- Section 1: Basic Information
  - Partner Name* (text input)
  - Partner ID Display* (auto-generated: "PART-XXXX")
  - Partner Type* (dropdown: "Investor", "Joint Venture", "Landowner", "Vendor")
  - Website (URL input with validation)
  - Is Active (toggle switch, default ON)
  
- Section 2: Primary Contact
  - Contact Name* (text input)
  - Contact Email* (email input with validation)
  - Contact Phone (phone input with formatting)
  - Preferred Contact Method (radio: Email/Phone/Both)
  
- Section 3: Site Assignments
  - Site Selection (multi-select dropdown of active sites)
  - For each selected site:
    - Role at Site* (dropdown: "Owner", "Investor", "Service Provider")
    - Markup Percentage* (number input 0-100)
    - Assignment Active (toggle, default ON)
    - Notes (textarea)
  
- Actions: Save | Save & Add Another | Cancel

**PartnerEdit_Form**
- Same as create but with:
  - Change history log at bottom
  - "Deactivate Partner" button (with confirmation)
  - "Reset Dashboard Access" security option

**PartnerAccess_Manager**
- Section 1: Dashboard Access
  - Enable Dashboard Access (toggle)
  - Dashboard URL: https://app.10nz.tools/partner/{partner-id}
  - Access Token: [Generate New] [Copy] [Revoke]
  - Token Expiry: Date picker or "Never"
  
- Section 2: Data Permissions (checkboxes in tree structure)
  - □ All Sites (or select specific)
    - □ Site A
      - □ View Operational Metrics
      - □ View Financial Data
      - □ View Task Lists
      - □ View Field Reports
    - □ Site B (same sub-options)
  
- Section 3: Report Subscriptions
  - □ Daily Summary (time picker for delivery)
  - □ Weekly Report (day selector)
  - □ Monthly Financial Report
  - □ Custom Alerts (configure thresholds)

#### 9.2 Dashboard Builder Interface (DashboardBuilder)

**DashboardBuilder_Canvas**
- Left Panel: Widget Library (collapsible)
  - Search widgets box
  - Categories: Metrics | Charts | Tables | Maps | Text
  - Draggable widget previews with names
  
- Center: Grid Canvas (12 columns)
  - Snap-to-grid functionality
  - Resize handles on widgets
  - Empty state: "Drag widgets here to start building"
  
- Right Panel: Widget Configuration
  - Shows when widget selected
  - Configuration options per widget type
  
- Top Bar:
  - Dashboard Name (editable)
  - Save | Preview | Publish buttons
  - Device preview toggles (Desktop/Tablet/Mobile)

**DashboardWidget_MetricCard Configuration**
- Data Source:
  - Metric Type* (dropdown: Revenue, Costs, Uptime %, Tasks Complete, etc.)
  - Site Filter (multi-select sites this partner can access)
  - Time Range (Last 24h, 7d, 30d, YTD, Custom)
  
- Display Options:
  - Title* (text input)
  - Show Trend (toggle)
  - Comparison Period (if trend enabled)
  - Number Format (Currency, Percentage, Decimal)
  - Color Scheme (Success/Warning/Danger/Custom)

**DashboardWidget_Chart Configuration**
- Chart Type* (dropdown with previews):
  - Line Chart (trends over time)
  - Bar Chart (comparisons)
  - Pie Chart (proportions)
  - Area Chart (cumulative)
  
- Data Configuration:
  - X-Axis: Metric selection
  - Y-Axis: Time period or categories
  - Series: Multiple data series support
  - Filters: Site, date range, equipment type
  
- Styling:
  - Title and subtitle
  - Legend position
  - Color palette
  - Show data labels (toggle)

**DashboardWidget_Table Configuration**
- Data Source:
  - Table Type* (Tasks, Field Reports, Financial Summary, Equipment Status)
  - Columns to Show (checkbox list)
  - Default Sort (column + direction)
  - Row Limit (10, 25, 50, 100)
  
- Filters:
  - Enable filtering (toggle)
  - Searchable (toggle)
  - Export options (CSV, Excel)

**DashboardWidget_Map Configuration**
- Map Settings:
  - Center Point (auto-detect from sites)
  - Zoom Level (slider)
  - Map Style (Satellite, Street, Terrain)
  
- Site Markers:
  - Show Sites (filtered by partner access)
  - Marker Info (Name, Status, Key Metric)
  - Status Colors (Operational=Green, Issues=Yellow, Offline=Red)

#### 9.3 Dashboard Viewer (PartnerDashboardView)

**DashboardView_Header**
- Partner Logo (left)
- Dashboard Title (center)
- Last Updated timestamp
- Refresh button
- Export menu (PDF, Excel, PowerPoint)
- Date range selector (global filter)

**DashboardView_Container**
- Responsive grid layout
- Loading states for each widget
- Error states with retry
- Auto-refresh indicator

**DashboardView_MobileOptimized**
- Stack widgets vertically
- Swipe between widgets
- Collapsed tables with expand
- Touch-optimized interactions

#### 9.4 Report Scheduler (ReportScheduler)

**ReportSchedule_Create**
- Report Name* (text)
- Report Type* (dropdown):
  - Executive Summary
  - Financial Detail
  - Operational Metrics
  - Custom Selection
  
- Recipients:
  - Primary: [Partner contact auto-filled]
  - Additional: Email input with + button
  
- Schedule:
  - Frequency* (Daily, Weekly, Monthly, Quarterly)
  - Send Time* (time picker)
  - Timezone (auto-detected)
  
- Content Selection (checkboxes):
  - □ Key Metrics Summary
  - □ Financial Performance
  - □ Site Status Updates
  - □ Task Completion Rates
  - □ Notable Events
  
- Format Options:
  - □ Include Charts
  - □ Include Raw Data Tables
  - □ Add Executive Summary
  
- Preview button | Save Schedule

### 10. Notification Center (NotificationCenter)
**Purpose**: Smart, contextual notifications
**Components**:
- NotificationList_Priority: Sorted by importance
- NotificationCard_Action: With quick action buttons
- NotificationFilter_Type: Filter by category
- NotificationSettings_Smart: Per-user preferences

### 11. Search Interface (SearchInterface)
**Purpose**: Universal search across all data
**Components**:
- SearchBar_Universal: Single search input
- SearchResults_Grouped: Results grouped by type
- SearchFilters_Dynamic: Filter by date, type, person
- SearchHistory_Recent: Recent searches

## Mobile-First Considerations
- **Thumb-friendly**: Important actions within thumb reach
- **Offline mode**: Clear indicator when offline, queue actions
- **Voice-first**: Voice input buttons prominent
- **Swipe actions**: Swipe to complete tasks, dismiss notifications
- **Progressive web app**: Installable, works offline

## Theme and Styling - shadcn/ui Configuration

### Tailwind Config for shadcn/ui
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
      },
    },
  },
}
```

### CSS Variables (globals.css)
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

@layer base {
  :root {
    --background: 0 0% 100%;          /* white */
    --foreground: 0 0% 0%;            /* black */
    
    --card: 0 0% 100%;                /* white */
    --card-foreground: 0 0% 0%;       /* black */
    
    --popover: 0 0% 100%;             /* white */
    --popover-foreground: 0 0% 0%;    /* black */
    
    --primary: 216 92% 50%;           /* #1890ff */
    --primary-foreground: 0 0% 100%;  /* white */
    
    --secondary: 0 0% 96%;            /* #f5f5f5 */
    --secondary-foreground: 0 0% 0%;  /* black */
    
    --muted: 0 0% 96%;                /* #f5f5f5 */
    --muted-foreground: 0 0% 40%;     /* #666666 */
    
    --accent: 0 0% 96%;               /* #f5f5f5 */
    --accent-foreground: 0 0% 0%;     /* black */
    
    --destructive: 0 100% 65%;        /* #ff4d4f */
    --destructive-foreground: 0 0% 100%; /* white */
    
    --border: 0 0% 93%;               /* #eeeeee */
    --input: 0 0% 87%;                /* #dddddd */
    --ring: 216 92% 50%;              /* #1890ff */
    
    --radius: 0.375rem;               /* 6px */
  }
}
```

### Design Principles
- **Modern & Clean**: Minimalist interface with high contrast
- **No Clutter**: Single-layer navigation, no nested menus
- **Focus on Content**: Minimal chrome, maximum work area
- **Clear Hierarchy**: Use size, weight, and spacing (not colors) for hierarchy

### Color Palette
- **Minimal Color Usage**: 
  - Primary: Deep blue (#1890ff) - primary actions only
  - Success: Green (#52c41a) - completed states
  - Warning: Orange (#faad14) - attention states
  - Danger: Red (#ff4d4f) - critical/destructive
  - Grays: #000 (text), #666 (secondary), #999 (tertiary), #eee (borders), #f8f8f8 (backgrounds)
- **High Contrast**:
  - Black text on white backgrounds
  - White text on dark buttons
  - No low-contrast gray text
  - WCAG AAA compliance

### Typography - IBM Plex Sans
- **Font Family**: 'IBM Plex Sans', system-ui, sans-serif
- **Weights**:
  - 400 (Regular): Body text, inputs
  - 500 (Medium): Button text, labels
  - 600 (SemiBold): Section headers, emphasis
  - 700 (Bold): Page titles only
- **Sizes**:
  - Page title: 32px/40px
  - Section header: 24px/32px
  - Card title: 18px/24px
  - Body: 16px/24px (high readability)
  - Small text: 14px/20px
  - Caption: 12px/16px (use sparingly)
- **Letter Spacing**: 
  - Titles: -0.02em (tighter)
  - Body: 0 (natural)
  - Small text: 0.01em (slightly looser)

### Layout Principles
- **Single-Level Navigation**: 
  - Top bar with primary actions
  - No dropdown menus
  - All actions visible or one click away
- **Card-Based**:
  - White cards on light gray background
  - 1px solid #eee borders
  - 8px radius (subtle, not rounded)
  - 0-2px shadow (barely visible)
- **Spacing System** (8px base):
  - 4px: Tight grouping
  - 8px: Related items  
  - 16px: Default spacing
  - 24px: Section breaks
  - 32px: Major sections
  - 48px: Page padding

### Component Styling
- **Buttons**:
  - Rectangular with 6px radius
  - Clear hover states (darken 10%)
  - Primary: Blue background, white text
  - Secondary: White background, 1px gray border
  - Minimum height: 44px (touch-friendly)
- **Inputs**:
  - 1px solid #ddd border
  - 6px radius
  - 12px horizontal padding
  - Focus: 2px blue outline (not glow)
  - Minimum height: 44px
- **Cards**:
  - Pure white background
  - 1px solid #eee border
  - No drop shadows in default state
  - Hover: subtle 0-2px shadow
- **Tables**:
  - Horizontal lines only (#eee)
  - No zebra striping
  - White background
  - Bold headers with bottom border

### Icons & Imagery
- **Icon Style**: 
  - Line icons only (no filled)
  - 20px default size
  - Consistent 2px stroke width
  - Lucide or Feather icon set
- **No Decorative Elements**:
  - No gradients
  - No patterns
  - No illustrations (unless data viz)
  - Photos only for personnel/sites

### Mobile Adaptations
- **Larger Touch Targets**: 48px minimum
- **Bottom Navigation**: Primary actions at thumb reach
- **Full-Width Elements**: Edge-to-edge on mobile
- **Simplified Layouts**: Stack instead of side-by-side

### Accessibility
- **Focus Indicators**: 2px solid outline (not glow)
- **Color Independence**: Never rely on color alone
- **Clear Labels**: Every input has a visible label
- **Error States**: Icon + color + text description

## State Management
- Loading states for all async operations
- Empty states with helpful actions
- Error states with recovery options
- Success feedback (toasts, animations)
- Offline queue indicator

## Accessibility
- High contrast mode support
- Screen reader friendly
- Keyboard navigation
- Large touch targets
- Clear focus indicators

## Special Features
- **Smart Suggestions**: AI-powered autocomplete
- **Context Awareness**: Different UI based on user role
- **Real-time Sync**: Live updates across devices
- **Batch Operations**: Multi-select for efficiency
- **Quick Actions**: Floating action button with common tasks

## Component Naming Convention
- Format: `[Feature]_[Component]_[Variant]`
- Examples: 
  - `TaskInput_Natural`
  - `ChatMessage_User`
  - `SiteCard_Status`
  - `NotificationCard_Critical`

This naming makes it clear what each component does and where it belongs in the system.

## shadcn/ui Component Usage Guide

### Essential Components to Install
```bash
# Core components needed for FLRTS
npx shadcn-ui@latest add card button form input textarea select
npx shadcn-ui@latest add dialog sheet popover dropdown-menu
npx shadcn-ui@latest add table badge avatar skeleton toast
npx shadcn-ui@latest add calendar command tabs alert
npx shadcn-ui@latest add radio-group checkbox switch
npx shadcn-ui@latest add collapsible separator progress
```

### Component Patterns

**1. Forms with Validation**
```tsx
// Use React Hook Form + Zod with shadcn Form components
const formSchema = z.object({
  description: z.string().min(1, "Task description is required"),
  assignee: z.string().min(1, "Please select an assignee"),
  priority: z.enum(["low", "normal", "high", "urgent"]),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: parsedTask,
})
```

**2. Data Tables**
```tsx
// Use Tanstack Table with shadcn Table components
import { DataTable } from "@/components/ui/data-table"

<DataTable
  columns={taskColumns}
  data={tasks}
  sorting
  filtering
  pagination
/>
```

**3. Command Palette**
```tsx
// Use for search and quick actions
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search tasks, reports, or actions..." />
  <CommandList>
    <CommandGroup heading="Actions">
      <CommandItem onSelect={() => createTask()}>
        <Plus className="mr-2 h-4 w-4" />
        Create Task
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

**4. Loading States**
```tsx
// Use Skeleton for loading states
{loading ? (
  <div className="space-y-3">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
) : (
  <TaskList tasks={tasks} />
)}
```

**5. Toast Notifications**
```tsx
// Use toast for feedback
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

toast({
  title: "Task created",
  description: "Assigned to Bryan Johnson",
  action: <ToastAction altText="View">View Task</ToastAction>,
})
```

### Mobile Patterns

**1. Sheet for Mobile Modals**
```tsx
// Use Sheet instead of Dialog on mobile
const isMobile = useMediaQuery("(max-width: 640px)")

{isMobile ? (
  <Sheet open={open} onOpenChange={setOpen}>
    <SheetContent side="bottom" className="h-[80vh]">
      <TaskForm />
    </SheetContent>
  </Sheet>
) : (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <TaskForm />
    </DialogContent>
  </Dialog>
)}
```

**2. Bottom Navigation**
```tsx
// Fixed bottom nav for mobile
<div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
  <nav className="flex h-16 items-center justify-around">
    <Button variant="ghost" size="icon">
      <Home className="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="icon">
      <Plus className="h-5 w-5" />
    </Button>
    <Button variant="ghost" size="icon">
      <User className="h-5 w-5" />
    </Button>
  </nav>
</div>
```

### Accessibility Patterns

**1. Focus Management**
```tsx
// Proper focus trapping in modals
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Task</DialogTitle>
      <DialogDescription>
        Create a new task using natural language
      </DialogDescription>
    </DialogHeader>
    {/* Content auto-focuses first input */}
  </DialogContent>
</Dialog>
```

**2. Keyboard Navigation**
```tsx
// Enable keyboard shortcuts
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen((open) => !open)
    }
  }
  document.addEventListener("keydown", down)
  return () => document.removeEventListener("keydown", down)
}, [])
```

## FLRTS Form Creation UI

### Field Report Creation Form

Create a form with the following fields and specifications:

**Schema**: site_id*, report_date*, report_type*, title*, content*, weather_conditions, issues_found, follow_up_required, parts_used[], time_spent_hours, images[], documents[]
**Design**: Two-column form, site selector with status, date picker, report type selector, content textarea, toggle switches, drag-drop for files

### Task Creation Form

Create a streamlined task form with smart defaults:

**Schema**: task_title*, task_description_detailed, assigned_to_user_id, site_id, due_date, priority (Low/Medium/High), tags[], estimated_hours
**Design**: Natural language input, assignee selector with availability, priority buttons, due date presets, tag autocomplete

### Reminder Creation Form

Create an intuitive reminder form with smart scheduling:

**Schema**: reminder_title*, reminder_date_time*, user_to_remind_id*, related_task_id, related_site_id, notification_channels[], recurrence_pattern, recurrence_end_date, reminder_notes
**Design**: Time picker with suggestions, user selector with status, notification channel toggles, recurrence builder

### List Creation Form

Create a flexible list form supporting various list types:

**Schema**: list_name*, list_type* (Checklist/Inventory/Shopping List/etc), site_id, description, list_data.items[], due_date, assigned_to
**Design**: Type selector with icons, dynamic item builder, drag-drop reorder, bulk import, templates

### Form Layout Patterns

1. **Mobile-First Responsive Design**:
   ```tsx
   <Sheet> // For mobile
     <SheetTrigger asChild>
       <Button>Create New</Button>
     </SheetTrigger>
     <SheetContent side="bottom" className="h-[90vh]">
       {/* Form content */}
     </SheetContent>
   </Sheet>
   
   <Dialog> // For desktop
     <DialogTrigger asChild>
       <Button>Create New</Button>
     </DialogTrigger>
     <DialogContent className="max-w-2xl">
       {/* Form content */}
     </DialogContent>
   </Dialog>
   ```

2. **Smart Field Behaviors**:
   - Site selector shows only sites user has access to
   - User selectors show availability status
   - Date/time pickers prevent past dates for future events
   - Auto-save drafts to localStorage
   - Keyboard shortcuts for quick submission (Ctrl+Enter)

3. **Validation & Feedback**:
   - Real-time validation as user types
   - Clear error messages below fields
   - Success toast with link to created item
   - Pending state during submission
   - Optimistic updates for better UX

4. **Natural Language Enhancement**:
   - Optional natural language input at top of each form
   - Parses text like "Remind Bryan tomorrow at 3pm to check generator"
   - Shows parsed fields for confirmation
   - Allows manual override of parsed values

## Additional Requirements

- All forms should validate inputs before submission
- Show loading states during data operations
- Display success/error messages clearly
- Support keyboard navigation
- Mobile-responsive design
- Use shadcn/ui form components with proper validation
- Implement auto-save for long forms
- Show character counts for text fields with limits
- Include help tooltips for complex fields
- Support offline mode with sync when online
- Track form analytics (completion rate, drop-off points)