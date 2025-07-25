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