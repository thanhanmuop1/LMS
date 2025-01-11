import React, { useState, useCallback } from 'react';
import { Button, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import VideoTableColumns from './VideoTableColumns';
import ChapterCard from './ChapterCard';
import VideoAssignQuizModal from './VideoAssignQuizModal';
import './video_management.css';

const { Title } = Typography;

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
  role,
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

        <VideoAssignQuizModal
          visible={isAssignQuizVisible}
          onCancel={onAssignQuizModalClose}
          selectedVideo={selectedVideoForQuiz}
          availableQuizzes={availableQuizzes}
          onQuizAssign={onQuizAssign}
          onQuizUnassign={onQuizUnassign}
          role={role}
        />
      </Spin>
    </div>
  );
};

export default VideoManagementBase; 