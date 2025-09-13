#!/bin/bash

# Brain Bot Frontend Generator
# Non-interactive script for generating Refine-based frontends

set -e

# Default values
APP_NAME="brain-bot-viewer"
FEATURES="tree-view,search,markdown-preview"
THEME="professional"
SKIP_INSTALL=false
OUTPUT_DIR="./generated-app"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --name)
      APP_NAME="$2"
      shift 2
      ;;
    --supabase-url)
      SUPABASE_URL="$2"
      shift 2
      ;;
    --supabase-key)
      SUPABASE_ANON_KEY="$2"
      shift 2
      ;;
    --features)
      FEATURES="$2"
      shift 2
      ;;
    --theme)
      THEME="$2"
      shift 2
      ;;
    --output)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    --skip-install)
      SKIP_INSTALL=true
      shift
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --name <name>          App name (default: brain-bot-viewer)"
      echo "  --supabase-url <url>   Supabase project URL (required)"
      echo "  --supabase-key <key>   Supabase anon key (required)"
      echo "  --features <features>  Comma-separated features (default: tree-view,search,markdown-preview)"
      echo "  --theme <theme>        Theme name (default: professional)"
      echo "  --output <dir>         Output directory (default: ./generated-app)"
      echo "  --skip-install         Skip npm install"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate required arguments
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "Error: --supabase-url and --supabase-key are required"
  exit 1
fi

echo "🚀 Brain Bot Frontend Generator"
echo "================================"
echo "App Name: $APP_NAME"
echo "Features: $FEATURES"
echo "Theme: $THEME"
echo "Output: $OUTPUT_DIR"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Step 1: Create Refine app non-interactively
echo "📦 Creating Refine app..."
cd "$OUTPUT_DIR"

# Create package.json first to avoid interactive prompts
cat > package.json << EOF
{
  "name": "$APP_NAME",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "refine": "refine"
  },
  "dependencies": {
    "@refinedev/antd": "^5.0.0",
    "@refinedev/cli": "^2.0.0",
    "@refinedev/core": "^4.0.0",
    "@refinedev/react-router-v6": "^4.0.0",
    "@refinedev/simple-rest": "^5.0.0",
    "@refinedev/supabase": "^5.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "antd": "^5.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-markdown": "^9.0.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
EOF

# Step 2: Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/{components,pages,hooks,utils,types}
mkdir -p public

# Step 3: Generate TypeScript types from Supabase
echo "🔧 Generating types from Supabase..."
cat > src/types/supabase.ts << 'EOF'
// Auto-generated types for brain_bot_documents table
export interface Database {
  public: {
    Tables: {
      brain_bot_documents: {
        Row: {
          id: string
          file_path: string
          title: string | null
          content: string
          content_hash: string
          metadata: Record<string, any>
          file_type: string | null
          category: string | null
          tags: string[]
          version: number
          previous_version_id: string | null
          is_public: boolean
          access_level: string
          created_by: string
          telegram_chat_id: number | null
          telegram_user_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['brain_bot_documents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['brain_bot_documents']['Insert']>
      }
    }
  }
}

export type Document = Database['public']['Tables']['brain_bot_documents']['Row']
EOF

# Step 4: Create Supabase client
echo "🔌 Setting up Supabase client..."
cat > src/utils/supabaseClient.ts << EOF
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = '$SUPABASE_URL'
const supabaseAnonKey = '$SUPABASE_ANON_KEY'

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
EOF

# Step 5: Create .env file
cat > .env << EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
VITE_APP_NAME=$APP_NAME
EOF

# Step 6: Copy component templates based on features
echo "🎨 Creating components based on features..."

# Create main App component
cat > src/App.tsx << 'EOF'
import { Refine } from "@refinedev/core";
import { RefineAntd } from "@refinedev/antd";
import routerProvider from "@refinedev/react-router-v6";
import { dataProvider } from "@refinedev/supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import "@refinedev/antd/dist/reset.css";

import { supabaseClient } from "./utils/supabaseClient";
import { DocumentList } from "./pages/documents/list";
import { DocumentShow } from "./pages/documents/show";

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <Refine
          dataProvider={dataProvider(supabaseClient)}
          routerProvider={routerProvider}
          resources={[
            {
              name: "brain_bot_documents",
              list: "/documents",
              show: "/documents/:id",
              meta: {
                label: "Documents",
              },
            },
          ]}
        >
          <Routes>
            <Route index element={<DocumentList />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/documents/:id" element={<DocumentShow />} />
          </Routes>
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
EOF

# Step 7: Create feature-specific components
if [[ "$FEATURES" == *"tree-view"* ]]; then
  echo "  📂 Adding FileTree component..."
  cp -r "$SCRIPT_DIR/templates/components/FileTree.tsx" src/components/
fi

if [[ "$FEATURES" == *"search"* ]]; then
  echo "  🔍 Adding Search component..."
  cp -r "$SCRIPT_DIR/templates/components/Search.tsx" src/components/
fi

if [[ "$FEATURES" == *"markdown-preview"* ]]; then
  echo "  📝 Adding MarkdownViewer component..."
  cp -r "$SCRIPT_DIR/templates/components/MarkdownViewer.tsx" src/components/
fi

# Step 8: Create basic pages
echo "📄 Creating pages..."
mkdir -p src/pages/documents

# Create Document List page
cat > src/pages/documents/list.tsx << 'EOF'
import { List, Table, Space, Tag } from "antd";
import { useTable } from "@refinedev/antd";
import { FileTree } from "../../components/FileTree";

export const DocumentList = () => {
  const { tableProps } = useTable({
    resource: "brain_bot_documents",
    sorters: {
      initial: [
        {
          field: "file_path",
          order: "asc",
        },
      ],
    },
  });

  return (
    <List>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
        <FileTree />
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="title" title="Title" />
          <Table.Column dataIndex="file_path" title="Path" />
          <Table.Column dataIndex="category" title="Category" />
          <Table.Column
            dataIndex="tags"
            title="Tags"
            render={(tags: string[]) => (
              <Space>
                {tags?.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            )}
          />
        </Table>
      </div>
    </List>
  );
};
EOF

# Create Document Show page
cat > src/pages/documents/show.tsx << 'EOF'
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Space, Tag } from "antd";
import ReactMarkdown from "react-markdown";

const { Title, Text } = Typography;

export const DocumentShow = () => {
  const { queryResult } = useShow({
    resource: "brain_bot_documents",
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={3}>{record?.title}</Title>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text type="secondary">Path: {record?.file_path}</Text>
        <Text type="secondary">Category: {record?.category}</Text>
        <Space>
          {record?.tags?.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
        <div style={{ marginTop: 24 }}>
          <ReactMarkdown>{record?.content || ""}</ReactMarkdown>
        </div>
      </Space>
    </Show>
  );
};
EOF

# Step 9: Create main.tsx and index.html
echo "🎯 Creating entry points..."

cat > src/main.tsx << 'EOF'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

cat > index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$APP_NAME</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Step 10: Create config files
echo "⚙️  Creating config files..."

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

cat > vite.config.ts << 'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
EOF

# Step 11: Install dependencies if not skipped
if [ "$SKIP_INSTALL" = false ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo ""
echo "✅ Frontend generated successfully!"
echo ""
echo "Next steps:"
echo "  cd $OUTPUT_DIR"
if [ "$SKIP_INSTALL" = true ]; then
  echo "  npm install"
fi
echo "  npm run dev"
echo ""
echo "The app will be available at http://localhost:5173"
echo ""
echo "Features included: $FEATURES"
echo "Theme: $THEME"