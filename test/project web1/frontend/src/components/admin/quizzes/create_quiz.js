import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const CreateQuiz = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const quizData = location.state?.quizData;
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing && !quizData) {
      fetchQuizData();
    } else if (quizData) {
      const points_per_question = quizData.questions?.[0]?.points || 1;
      
      form.setFieldsValue({
        title: quizData.title,
        duration_minutes: quizData.duration_minutes,
        points_per_question: points_per_question,
        passing_score: quizData.passing_score,
      });
    }
  }, [id, quizData, form]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/quizzes/${id}`);
      const quiz = response.data;
      
      const points_per_question = quiz.questions?.[0]?.points || 1;

      form.setFieldsValue({
        title: quiz.title,
        duration_minutes: quiz.duration_minutes,
        points_per_question: points_per_question,
        passing_score: quiz.passing_score,
      });
    } catch (error) {
      message.error('Không thể tải thông tin quiz');
      navigate('/admin/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const quizData = {
        title: values.title,
        duration_minutes: values.duration_minutes,
        passing_score: values.passing_score,
        points_per_question: values.points_per_question,
      };

      if (isEditing) {
        const questions = quizData.questions?.map(q => ({
          ...q,
          points: values.points_per_question
        }));
        
        await axios.put(`http://localhost:5000/quizzes/${id}`, {
          ...quizData,
          questions
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Cập nhật quiz thành công');
      } else {
        await axios.post('http://localhost:5000/quizzes', {
          ...quizData,
          questions: []
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Tạo quiz thành công');
      }
      
      navigate('/admin/quizzes');
    } catch (error) {
      message.error(`Có lỗi xảy ra khi ${isEditing ? 'cập nhật' : 'tạo'} quiz`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>{isEditing ? 'Chỉnh Sửa Quiz' : 'Tạo Quiz Mới'}</h2>
      </div>

      <div className="admin-content" style={{ maxWidth: 600, margin: '0 auto' }}></div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            duration_minutes: 30,
            passing_score: 60,
            points_per_question: 1
          }}
        >
          <Form.Item
            name="title"
            label="Tên Quiz"
            rules={[{ required: true, message: 'Vui lòng nhập tên quiz' }]}
          >
            <Input placeholder="Nhập tên quiz" />
          </Form.Item>

          <Form.Item
            name="duration_minutes"
            label="Thời gian làm bài (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="points_per_question"
            label="Điểm mỗi câu"
            rules={[{ required: true, message: 'Vui lòng nhập điểm mỗi câu' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="passing_score"
            label="Điểm đạt"
            rules={[{ required: true, message: 'Vui lòng nhập điểm đạt' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEditing ? 'Cập nhật' : 'Tiếp tục'}
            </Button>
            <Button 
              onClick={() => navigate('/admin/quizzes')} 
              style={{ marginLeft: 8 }}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};

export default CreateQuiz; 