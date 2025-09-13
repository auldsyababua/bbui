# Brain Bot Frontend Generator

**Purpose**: Generate Refine-based frontends for the markdown-brain-bot Supabase database non-interactively.

## 🤖 Designed for AI Agents

This repository provides templates and scripts that allow Claude Code (or other AI agents) to generate fully functional frontend applications for viewing and managing documents stored in the markdown-brain-bot's Supabase database.

## 📊 Understanding the Brain Bot Architecture

### Database Structure
The markdown-brain-bot uses three databases:

1. **Supabase** - Document storage with metadata
   - Table: `brain_bot_documents`
   - Stores: file paths, content, titles, categories, tags
   - Acts as the "file system" for the bot

2. **Upstash Vector** - Semantic search
   - Stores mathematical embeddings of documents
   - File paths are just metadata - no actual folder structure
   - Enables similarity-based retrieval

3. **Redis** - Conversation state
   - Temporary storage for chat contexts
   - 1-hour TTL for user sessions

### Key Concepts
- **No Local Files**: Production uses ONLY Supabase + Vector databases
- **CAG Philosophy**: Creation Augmented Generation - append-only, source-preserving
- **Shared Namespace**: MVP uses empty string `""` namespace - all users share knowledge
- **File Paths**: Just strings in the database, not real filesystem paths

## 🗄️ Supabase Schema

```sql
CREATE TABLE brain_bot_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_path TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    file_type TEXT DEFAULT 'note',
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    version INTEGER DEFAULT 1,
    previous_version_id UUID REFERENCES brain_bot_documents(id),
    is_public BOOLEAN DEFAULT false,
    access_level TEXT DEFAULT 'private',
    created_by TEXT DEFAULT 'manual',
    telegram_chat_id BIGINT,
    telegram_user_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_file_path ON brain_bot_documents(file_path);
CREATE INDEX idx_category ON brain_bot_documents(category);
CREATE INDEX idx_tags ON brain_bot_documents USING GIN(tags);
CREATE INDEX idx_content_hash ON brain_bot_documents(content_hash);
```

## 🎯 Frontend Requirements

The generated frontend should provide:

1. **File Tree View**
   - Display documents hierarchically based on `file_path`
   - Categories as folders (e.g., `10NetZero/sites/Eagle Lake`)
   - Visual indicators for document types

2. **Document Viewer**
   - Markdown rendering for content
   - Metadata display (tags, created by, dates)
   - Search functionality

3. **Search Interface**
   - Full-text search across documents
   - Filter by category, tags, date
   - Integration with Vector search results

4. **Index Management**
   - View auto-generated indexes
   - Understand document organization

## 🚀 Quick Start

### Prerequisites
```bash
# Required environment variables (from brain-bot .env)
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
```

### Generate a Frontend
```bash
# Clone this generator
git clone <this-repo> brain-bot-frontend-generator
cd brain-bot-frontend-generator

# Run the generator
./generate-frontend.sh \
  --name "brain-bot-viewer" \
  --supabase-url "$SUPABASE_URL" \
  --supabase-key "$SUPABASE_ANON_KEY"
```

## 📁 Repository Structure

```
brain-bot-frontend-generator/
├── templates/
│   ├── refine-base/          # Base Refine app template
│   ├── components/           # Reusable components
│   │   ├── FileTree.tsx     # File tree component
│   │   ├── DocumentViewer.tsx
│   │   └── SearchBar.tsx
│   └── hooks/               # Custom React hooks
├── scripts/
│   ├── generate-frontend.sh  # Main generation script
│   ├── setup-refine.js      # Non-interactive Refine setup
│   └── generate-types.js    # Supabase type generation
├── prompts/
│   └── customize-frontend.md # AI instructions for customization
└── examples/
    └── generated-app/       # Example of generated output
```

## 🤖 Non-Interactive Generation

The generator works without user interaction:

1. **Type Generation**: Automatically pulls types from Supabase
2. **Component Generation**: Creates components based on schema
3. **Route Setup**: Configures routes for document viewing
4. **Authentication**: Optional Supabase auth integration

### Example Command for Claude Code
```bash
# Generate complete frontend
./scripts/generate-frontend.sh \
  --name "10netzero-docs" \
  --features "tree-view,search,markdown-preview" \
  --theme "professional" \
  --skip-install
```

## 🔧 Customization Options

### Features Flag
- `tree-view`: Hierarchical document display
- `search`: Full-text and vector search
- `markdown-preview`: Rich document rendering
- `metadata-panel`: Show all document metadata
- `version-history`: Show document versions
- `auth`: Enable Supabase authentication

### Theme Options
- `professional`: Clean business UI
- `minimal`: Simplified interface
- `dark`: Dark mode default

## 📝 Component Templates

### FileTree Component
```tsx
// Auto-generated from Supabase schema
export const FileTree: React.FC = () => {
  const { data: documents } = useDocuments();
  const tree = buildTreeFromPaths(documents);
  
  return <TreeView data={tree} onSelect={handleSelect} />;
};
```

### Document Viewer
```tsx
// Renders markdown with metadata
export const DocumentViewer: React.FC<{docId: string}> = ({ docId }) => {
  const { data: doc } = useDocument(docId);
  
  return (
    <div>
      <MarkdownPreview content={doc.content} />
      <MetadataPanel data={doc.metadata} />
    </div>
  );
};
```

## 🔗 Integration with Brain Bot

### Real-time Updates
The frontend can subscribe to Supabase real-time updates:
```typescript
// Subscribe to document changes
supabase
  .channel('documents')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'brain_bot_documents' },
    handleDocumentChange
  )
  .subscribe();
```

### Search Integration
While the frontend can't directly query the Vector database, it can:
1. Display search results passed from the bot
2. Show semantic similarity scores
3. Highlight relevant sections

## 🚦 Environment Variables

```bash
# Required
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_APP_NAME="Brain Bot Documents"
VITE_ENABLE_AUTH=false
VITE_DEFAULT_CATEGORY="10NetZero"
```

## 📚 Understanding Document Organization

### Categories
- Root: `10NetZero`
- Sites: `10NetZero/sites/[SiteName]`
- Test Docs: `10NetZero/db_test_docs_do_not_modify`

### Document Types
- `note`: General notes and documentation
- `checklist`: Task lists and checklists
- `report`: Formal reports
- `index`: Auto-generated index files

### Special Files
- `index.md`: Auto-generated category indexes
- Files in `db_test_docs_do_not_modify`: Required for tests

## 🧪 Testing Generated Apps

```bash
# After generation
cd generated-app
npm install
npm run dev

# Run tests
npm test
```

## 🤝 Contributing

When adding new templates or components:
1. Ensure they work with the Supabase schema
2. Make them AI-friendly (clear props, good defaults)
3. Include TypeScript types
4. Add examples in the examples/ directory

## 📖 Related Documentation

- [Brain Bot Architecture](../markdown-brain-bot/ARCHITECTURE.md)
- [Supabase Schema](../markdown-brain-bot/docs/database-schema.sql)
- [Refine Documentation](https://refine.dev/docs/)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

## 🎯 Next Steps

1. Clone this repository
2. Set up your environment variables
3. Run the generator
4. Deploy to Vercel/Netlify/etc

---

**Note**: This generator is specifically designed for the markdown-brain-bot's Supabase schema. It won't work with arbitrary databases without modification.