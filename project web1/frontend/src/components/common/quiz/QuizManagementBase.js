import React from 'react';
import { Table, Button, Space, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const QuizManagementBase = ({
  quizzes,
  courses,
  loading,
  onDelete,
  onAdd,
  onEdit,
  onQuestionClick,
  role // 'admin' or 'teacher'
}) => {
  const handleDelete = (quizId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa quiz này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        onDelete(quizId);
      },
    });
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Khóa học',
      key: 'course',
      render: (_, record) => {
        const courseId = record.course_id;
        
        if (!courseId) {
          if (record.video) {
            courseId = record.video.course_id;
          } else if (record.chapter) {
            courseId = record.chapter.course_id;
          }
        }
        
        const course = courses.find(c => c.id === courseId);
        return course ? course.title : 'Chưa gán';
      }
    },
    {
      title: 'Đã gán cho',
      key: 'assigned_to',
      render: (_, record) => {
        if (record.video_id) {
          return `Video: ${record.video_title || record.video_id}`;
        } else if (record.chapter_id) {
          return `Chương: ${record.chapter_title || record.chapter_id}`;
        }
        return 'Chưa gán';
      }
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'question_count',
      key: 'question_count',
      render: (question_count, record) => (
        <Button 
          type="link" 
          onClick={() => onQuestionClick(record)}
          style={{ padding: 0 }}
        >
          {question_count || 0}
        </Button>
      )
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
    },
    {
      title: 'Điểm đạt',
      dataIndex: 'passing_score',
      key: 'passing_score',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="quiz-management">
      <div className="quiz-header">
        <h2>Quản lý Quiz</h2>
        <Button
          type="primary"
          onClick={onAdd}
        >
          Thêm Quiz
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={quizzes}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default QuizManagementBase; 