import React from 'react';
import { Modal, List, Button, Empty, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const VideoAssignQuizModal = ({
  visible,
  onCancel,
  selectedVideo,
  availableQuizzes,
  onQuizAssign,
  onQuizUnassign,
  role
}) => {
  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    const path = role === 'admin' ? '/admin/quizzes/create' : '/teacher/quizzes/create';
    navigate(path);
    onCancel();
  };

  return (
    <Modal
      title={`Quản lý Quiz cho Video: ${selectedVideo?.title || ''}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleCreateQuiz}>
          Tạo Quiz mới
        </Button>
      </div>

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
  );
};

export default VideoAssignQuizModal; 