# Generate Brain Bot Frontend

## Context
You need to create a frontend application for viewing documents stored in the markdown-brain-bot's Supabase database. The brain-bot-frontend-generator provides a non-interactive way to generate a complete Refine-based application.

## Prerequisites
Ensure you have access to:
1. The Supabase URL and anon key from the brain-bot's `.env` file
2. Node.js 18+ installed
3. The brain-bot-frontend-generator repository

## Task
Generate a frontend application with the following features:
- File tree view showing document hierarchy
- Document viewer with markdown rendering
- Search functionality
- Clean, professional UI

## Steps

1. **Navigate to the generator directory**:
   ```bash
   cd /Users/colinaulds/Desktop/projects/brain-bot-frontend-generator
   ```

2. **Get the Supabase credentials**:
   ```bash
   # From the brain-bot project
   cd /Users/colinaulds/Desktop/projects/markdown-brain-bot
   grep SUPABASE .env
   ```

3. **Run the generator**:
   ```bash
   cd /Users/colinaulds/Desktop/projects/brain-bot-frontend-generator
   ./generate-frontend.sh \
     --name "brain-bot-docs" \
     --supabase-url "<SUPABASE_URL>" \
     --supabase-key "<SUPABASE_ANON_KEY>" \
     --features "tree-view,search,markdown-preview,metadata-panel" \
     --theme "professional" \
     --output "./brain-bot-docs-app"
   ```

4. **Create the FileTree component** (if not exists):
   ```typescript
   // src/components/FileTree.tsx
   import React, { useState, useMemo } from 'react';
   import { Tree } from 'antd';
   import { FolderOutlined, FileOutlined } from '@ant-design/icons';
   import { useList } from '@refinedev/core';
   import type { Document } from '../types/supabase';
   
   interface TreeNode {
     title: string;
     key: string;
     icon?: React.ReactNode;
     children?: TreeNode[];
     isLeaf?: boolean;
     document?: Document;
   }
   
   export const FileTree: React.FC<{ onSelect?: (doc: Document) => void }> = ({ onSelect }) => {
     const [expandedKeys, setExpandedKeys] = useState<string[]>(['10NetZero']);
     
     const { data, isLoading } = useList<Document>({
       resource: 'brain_bot_documents',
       pagination: { pageSize: 1000 },
       sorters: [{ field: 'file_path', order: 'asc' }],
     });
     
     const treeData = useMemo(() => {
       if (!data?.data) return [];
       
       const tree: { [key: string]: TreeNode } = {};
       const rootNodes: TreeNode[] = [];
       
       // Build tree structure
       data.data.forEach((doc) => {
         const parts = doc.file_path.split('/');
         let currentPath = '';
         let parent: TreeNode[] = rootNodes;
         
         parts.forEach((part, index) => {
           currentPath = currentPath ? `${currentPath}/${part}` : part;
           
           if (!tree[currentPath]) {
             const isLeaf = index === parts.length - 1;
             const node: TreeNode = {
               title: part,
               key: currentPath,
               icon: isLeaf ? <FileOutlined /> : <FolderOutlined />,
               isLeaf,
               children: isLeaf ? undefined : [],
               document: isLeaf ? doc : undefined,
             };
             
             tree[currentPath] = node;
             parent.push(node);
           }
           
           if (!tree[currentPath].isLeaf) {
             parent = tree[currentPath].children!;
           }
         });
       });
       
       return rootNodes;
     }, [data]);
     
     const handleSelect = (selectedKeys: React.Key[], info: any) => {
       const node = info.node as TreeNode;
       if (node.document && onSelect) {
         onSelect(node.document);
       }
     };
     
     return (
       <Tree
         showIcon
         defaultExpandedKeys={expandedKeys}
         expandedKeys={expandedKeys}
         onExpand={setExpandedKeys}
         treeData={treeData}
         onSelect={handleSelect}
         style={{ background: '#f5f5f5', padding: 16, height: '100vh', overflow: 'auto' }}
       />
     );
   };
   ```

5. **Update the DocumentList page to use FileTree**:
   ```typescript
   // Update src/pages/documents/list.tsx
   import { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import { Document } from '../../types/supabase';
   
   // In the component:
   const navigate = useNavigate();
   const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
   
   const handleDocumentSelect = (doc: Document) => {
     setSelectedDoc(doc);
     navigate(`/documents/${doc.id}`);
   };
   
   // In the render:
   <FileTree onSelect={handleDocumentSelect} />
   ```

6. **Install and run**:
   ```bash
   cd brain-bot-docs-app
   npm install
   npm run dev
   ```

## Expected Output
- A fully functional Refine app at http://localhost:5173
- File tree showing document hierarchy
- Click on documents to view content
- Markdown rendering for document content
- Search functionality (if implemented)

## Customization
After generation, you can:
1. Modify the theme in `src/App.tsx`
2. Add more features to components
3. Implement search functionality
4. Add authentication if needed

## Troubleshooting
- If Supabase connection fails, verify the URL and key
- If types are incorrect, regenerate them with Supabase CLI
- Check browser console for any runtime errors