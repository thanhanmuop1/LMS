import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const QuizManagement = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Có lỗi xảy ra khi tải danh sách khóa học');
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/quizzes');
      console.log('Fetched quizzes:', response.data);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      message.error('Có lỗi xảy ra khi tải danh sách quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, []);

  const handleDelete = (quizId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa quiz này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/quizzes/${quizId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          message.success('Xóa quiz thành công');
          fetchQuizzes();
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa quiz');
        }
      },
    });
  };

  const handleAddQuiz = () => {
    navigate('/admin/quizzes/create');
  };

  const handleEditQuiz = (quiz) => {
    navigate(`/admin/quizzes/edit/${quiz.id}`, { state: { quizData: quiz } });
  };

  const handleQuestionClick = (quiz) => {
    navigate(`/admin/quizzes/${quiz.id}/questions`, { state: { quizData: quiz } });
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Khóa học',
      dataIndex: 'course_title',
      key: 'course_title',
      render: (_, record) => {
        const course = courses.find(c => c.id === record.course_id);
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
          onClick={() => handleQuestionClick(record)}
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
            onClick={() => handleEditQuiz(record)}
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
          onClick={handleAddQuiz}
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

export default QuizManagement; 