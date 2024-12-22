import React, { useState, useCallback } from 'react';
import { Button, Spin, Modal, List, Empty, Tag, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import VideoTableColumns from './VideoTableColumns';
import ChapterCard from './ChapterCard';
import './video_management.css';

const { Title } = Typography;
const { confirm } = Modal;

const VideoManagementBase = ({
  courseInfo,
  chapters,
  videos,
  loading,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onManageDocuments,
  onAssignQuiz,
  availableQuizzes,
  selectedVideoForQuiz,
  isAssignQuizVisible,
  onAssignQuizModalClose,
  onQuizAssign,
  onQuizUnassign,
}) => {
  const videoColumns = VideoTableColumns({
    onEdit: onEditVideo,
    onDelete: onDeleteVideo,
    onManageDocuments,
    onAssignQuiz,
  });

  const getVideosByChapter = (chapterId) => {
    return videos.filter(video => video.chapter_id === chapterId);
  };

  return (
    <div className="video-management">
      <Spin spinning={loading}>
        <div className="page-header">
          <Title level={2}>Quản lý video - {courseInfo?.title}</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onAddChapter}
          >
            Thêm chương mới
          </Button>
        </div>

        <div className="chapters-container">
          {chapters.map(chapter => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              videos={getVideosByChapter(chapter.id)}
              videoColumns={videoColumns}
              onAddVideo={() => onAddVideo(chapter)}
              onEditChapter={() => onEditChapter(chapter)}
              onDeleteChapter={() => onDeleteChapter(chapter.id)}
            />
          ))}
        </div>

        <Modal
          title={`Quản lý Quiz cho Video: ${selectedVideoForQuiz?.title || ''}`}
          open={isAssignQuizVisible}
          onCancel={onAssignQuizModalClose}
          footer={null}
          width={800}
        >
          {availableQuizzes.length === 0 ? (
            <Empty 
              description="Không có quiz nào khả dụng"
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          ) : (
            <List
              dataSource={availableQuizzes}
              renderItem={quiz => (
                <List.Item
                  actions={[
                    quiz.is_assigned ? (
                      <Button
                        type="primary"
                        danger
                        onClick={() => onQuizUnassign(quiz.id)}
                      >
                        Hủy gán
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => onQuizAssign(quiz.id)}
                      >
                        Gán
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {quiz.title}
                        {quiz.is_assigned && (
                          <Tag color="green">Đã gán</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <Space direction="vertical">
                        <span>Loại: Quiz video</span>
                        <span>Thời gian: {quiz.duration_minutes} phút</span>
                        <span>Điểm đạt: {quiz.passing_score}%</span>
                        <span>Số câu hỏi: {quiz.question_count}</span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Modal>
      </Spin>
    </div>
  );
};

export default VideoManagementBase; 