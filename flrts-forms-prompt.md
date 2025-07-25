# FLRTS Form Input UI Design

Create forms for Field Reports, Tasks, Reminders, and Lists using shadcn/ui components. Use IBM Plex Sans font, high contrast design.

## New Field Report Form

**Layout**: Two columns on desktop, single column on mobile

**Fields**:
- Site* - Dropdown with site names and status indicators
- Report Date* - Date picker with calendar icon
- Report Type* - Segmented control: Maintenance | Inspection | Incident | Installation | Decommission | Other
- Title* - Text input (max 255 chars)
- Content* - Large textarea with auto-resize
- Weather Conditions - Text input (optional)
- Issues Found - Toggle switch
- Follow-up Required - Toggle switch  
- Parts Used - Tag input with add/remove
- Time Spent (hours) - Number input
- Attachments - Drag-drop zone for images/documents

**Bottom**: Cancel | Save as Draft | Submit Report

## New Task Form

**Layout**: Single column, expandable sections

**Fields**:
- Natural Language Input - Large textarea at top: "Tell Bryan to check generator oil at Eagle Lake tomorrow at 3pm"
- Show Parsed Preview - Card showing extracted details
- Task Title* - Text input (max 255 chars)
- Description - Textarea (optional)
- Assigned To - Dropdown with user avatars and availability status
- Site - Dropdown (optional)
- Due Date - Date picker with quick presets: Today | Tomorrow | Next Week
- Priority - Radio buttons: 🔵 Low | 🟡 Medium | 🔴 High
- Tags - Input with autocomplete from existing tags
- Estimated Hours - Number input

**Bottom**: Cancel | Create Task

## New Reminder Form

**Layout**: Single column

**Fields**:
- Reminder Title* - Text input (max 255 chars)
- Date & Time* - DateTime picker with smart suggestions: Start of day | End of day | Lunch (12pm)
- Remind Who* - User selector showing profile pic and current status
- Related Task - Searchable dropdown (optional)
- Related Site - Dropdown (optional)
- Notification Channels - Checkbox group: ☑️ Telegram | ☐ Email | ☐ SMS | ☐ Push
- Recurrence - Dropdown: None | Daily | Weekly | Monthly | Custom
- If Custom - Show recurrence builder
- Notes - Textarea (optional)

**Bottom**: Cancel | Set Reminder

## New List Form

**Layout**: Dynamic based on list type

**Fields**:
- List Name* - Text input (max 255 chars)
- List Type* - Icon grid selector:
  - ✓ Checklist
  - 📦 Inventory
  - 🛒 Shopping List
  - 🔧 Maintenance Schedule
  - ⚠️ Safety Checklist
  - ⚙️ Equipment List
  - 👥 Contact List
  - 📋 Procedure
  - ➕ Other
- Site - Dropdown (optional)
- Description - Textarea (optional)
- List Items - Dynamic item builder:
  - For Checklist: Checkbox + Text
  - For Inventory: Text + Quantity + Unit
  - For Shopping: Text + Quantity
  - Add item button at bottom
  - Drag handles for reordering
- Bulk Import - "Paste items from clipboard" link
- Due Date - Date picker (optional)
- Assigned To - User selector (optional)

**Bottom**: Cancel | Create List

## Common Patterns

**Required fields**: Mark with asterisk (*)
**Mobile**: Use bottom sheet (90vh height)
**Desktop**: Use modal dialog (max-width: 600px)
**Validation**: Show inline errors below fields
**Loading**: Disable submit button, show spinner
**Success**: Show toast with link to created item