import React from 'react';
import { Card, Button, Space, Table } from 'antd';
import { VideoCameraAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ChapterCard = ({ 
  chapter, 
  videos, 
  videoColumns, 
  onAddVideo, 
  onEditChapter, 
  onDeleteChapter 
}) => {
  return (
    <Card 
      key={chapter.id}
      className="chapter-card"
      title={
        <div className="chapter-header">
          <span>{chapter.title}</span>
          <Space>
            <Button
              type="primary"
              icon={<VideoCameraAddOutlined />}
              size="small"
              onClick={() => onAddVideo(chapter)}
            >
              Thêm video
            </Button>
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEditChapter(chapter)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDeleteChapter(chapter.id)}
            />
          </Space>
        </div>
      }
    >
      <Table 
        columns={videoColumns} 
        dataSource={videos}
        pagination={false}
        rowKey="id"
        size="small"
      />
    </Card>
  );
};

export default ChapterCard; 