import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FileTree } from '../../components';
import { Document } from '../../types/supabase';
import ReactMarkdown from 'react-markdown';

const { Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

export const DocumentList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  const handleDocumentSelect = (doc: Document) => {
    setSelectedDoc(doc);
    // Optional: navigate to a dedicated view page
    // navigate(`/documents/${doc.id}`);
  };
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          style={{ marginBottom: '16px' }}
        >
          Back to Tools
        </Button>
        <Title level={3} style={{ margin: 0 }}>Supabase File Viewer</Title>
      </div>
      <Layout>
        <Sider width={350} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px' }}>
            <Title level={4}>Documents</Title>
          </div>
          <FileTree onSelect={handleDocumentSelect} />
        </Sider>
        <Content style={{ padding: '24px', background: '#fff' }}>
          {selectedDoc ? (
            <Card>
              <Title level={3}>{selectedDoc.title || selectedDoc.file_path.split('/').pop()}</Title>
              <Paragraph type="secondary">
                Path: {selectedDoc.file_path}
              </Paragraph>
              {selectedDoc.tags && selectedDoc.tags.length > 0 && (
                <Paragraph>
                  Tags: {selectedDoc.tags.join(', ')}
                </Paragraph>
              )}
              <div style={{ marginTop: '24px' }}>
                <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
              </div>
            </Card>
          ) : (
            <Card>
              <Title level={4}>Select a document</Title>
              <Paragraph>
                Choose a document from the file tree to view its contents.
              </Paragraph>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};