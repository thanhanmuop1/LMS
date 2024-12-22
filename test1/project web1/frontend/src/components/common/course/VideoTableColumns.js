import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const VideoTableColumns = ({ onEdit, onDelete, onManageDocuments, onAssignQuiz }) => {
  return [
    {
      title: 'Tên video',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'URL Video',
      dataIndex: 'video_url',
      key: 'video_url',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space>
          <Button 
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button 
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
          />
          <Button
            type="link"
            onClick={() => onManageDocuments(record)}
          >
            Tài liệu
          </Button>
          <Button
            type="primary"
            onClick={() => onAssignQuiz(record)}
          >
            Gán Quiz
          </Button>
        </Space>
      ),
    },
  ];
};

export default VideoTableColumns; 