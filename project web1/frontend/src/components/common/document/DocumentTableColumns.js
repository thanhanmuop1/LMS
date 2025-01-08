import React from 'react';
import { Button, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const DocumentTableColumns = ({ onDownload, onDelete }) => {
  return [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Loại file',
      dataIndex: 'file_type',
      key: 'file_type',
      render: (text) => text.toUpperCase(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onDownload(record)}>
            Tải xuống
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          />
        </Space>
      ),
    },
  ];
};

export default DocumentTableColumns; 