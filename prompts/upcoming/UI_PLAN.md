# PM Handoff: FLRTS UI Development Plan for BBUI

## Context for Next PM

The user requested a comprehensive UI development plan that ties BBUI (Brain Bot UI) to markdown-brain-bot development events, based on the FLRTS (Field Reports, Lists, Reminders, Tasks & Subtasks) project vision.

## What I've Analyzed

### 1. FLRTS/gpt-parser Project Files Read
- `/Users/colinaulds/Desktop/projects/gpt-parser/ROADMAP.md` - 14-phase development roadmap
- `/Users/colinaulds/Desktop/projects/gpt-parser/USER-STORIES.md` - User stories for field techs, ops manager, partners
- `/Users/colinaulds/Desktop/projects/gpt-parser/VISION.md` - Overall vision for FLRTS system

### 2. Key FLRTS Insights
- **Current State**: gpt-parser is Phase 1 - natural language task parsing via Telegram
- **Storage**: Currently uses Google Sheets, moving to PostgreSQL in Phase 3
- **Users**: Field technicians (Bryan, Joel), Operations Manager (Colin), Partners/Stakeholders
- **Core Feature**: Natural language → structured task data

### 3. BBUI Current State
- Frontend generator for markdown-brain-bot's Supabase database
- Already has a generated app in `brain-bot-docs-app/`
- Missing FileTree component (referenced but not implemented)
- Has user management prompt created

### 4. markdown-brain-bot Connection
- Brain bot stores documents in Supabase
- Uses vector database for semantic search
- Telegram interface for adding/searching content
- Auto-organization philosophy

## Task to Complete

Create a comprehensive UI development plan that:

1. **Maps FLRTS Phases to BBUI Features**
   - Phase 1-2: Task viewing/management UI
   - Phase 3: Database migration UI tools
   - Phase 4: Enhanced Telegram integration status
   - Phase 5: Web dashboard (main BBUI role)
   - Phase 6-9: Advanced features

2. **Defines Integration Points**
   - When FLRTS moves from Google Sheets to PostgreSQL (Phase 3)
   - How BBUI can display both brain-bot documents AND FLRTS tasks
   - Unified search across documents and tasks
   - Real-time updates from Telegram actions

3. **Creates Development Milestones**
   - Milestone 1: Read-only task viewer (while FLRTS uses Sheets)
   - Milestone 2: Task management UI (when FLRTS gets DB)
   - Milestone 3: Unified document + task interface
   - Milestone 4: Field reporting dashboard
   - Milestone 5: Financial/analytics views

4. **Technical Architecture Decisions**
   - How to handle dual data sources (Supabase for docs, Sheets/PostgreSQL for tasks)
   - Real-time sync strategy between Telegram bot and UI
   - Shared authentication between brain-bot and FLRTS
   - API gateway pattern for multiple backends

## Specific Events to Tie Together

### markdown-brain-bot Events → BBUI Actions
1. **Document Created** → Update FileTree, refresh search index
2. **Document Merged** → Show merge history in UI
3. **Vector Search Updated** → Enable semantic search in UI
4. **User Query** → Display in activity feed

### FLRTS Events → BBUI Actions
1. **Task Created** → Show in task list, update dashboard
2. **Task Assigned** → Notify in UI, update technician view
3. **Field Report Submitted** → Display in reports section
4. **Task Completed** → Update metrics, trigger animations

## File to Create

Create: `/Users/colinaulds/Desktop/projects/bbui/prompts/flrts-ui-development-plan.md`

This should be a detailed 15-20 page document covering:
- Executive summary
- Phase-by-phase UI development
- Technical architecture
- Integration strategies
- Mock-ups/wireframes descriptions
- API specifications
- Timeline with dependencies
- Risk mitigation
- Success metrics

## Current Todo State

Pending tasks:
- Create FileTree component template
- Test generator with Supabase credentials  
- Update generator to copy FileTree component
- Create search functionality template
- Create FLRTS UI development plan (IN PROGRESS)

## Next Steps for New PM

1. Read all three FLRTS files completely
2. Review the existing BBUI generated app structure
3. Create the comprehensive development plan document
4. Consider creating visual diagrams (describe them in markdown)
5. Define clear handoff points between systems
6. Specify API contracts between BBUI, brain-bot, and FLRTS

## Important Considerations

- FLRTS is currently Phase 1 (MVP) but planning for 14 phases
- BBUI needs to be flexible enough to adapt as FLRTS evolves
- Both systems share the 10NetZero context (energy infrastructure)
- Field technicians need mobile-first design
- Offline capability is crucial for remote sites
- Financial features are high priority (markup calculations, profit sharing)

The comprehensive plan should enable BBUI to grow alongside FLRTS while maintaining its role as the primary web interface for both document management (brain-bot) and task management (FLRTS).