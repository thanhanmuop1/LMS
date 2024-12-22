import React, { useState, useEffect, useCallback } from 'react';
import { message, Modal } from 'antd';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const VideoManagementProvider = ({
  courseId,
  role = 'teacher', // 'admin' or 'teacher'
  children
}) => {
  const [videos, setVideos] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);

  const baseUrl = role === 'admin' ? 'http://localhost:5000' : 'http://localhost:5000/teacher';

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [courseResponse, chaptersResponse, videosResponse] = await Promise.all([
        axios.get(`${baseUrl}/courses/${courseId}`, { headers }),
        axios.get(`${baseUrl}/courses/${courseId}/chapters`, { headers }),
        axios.get(`${baseUrl}/courses/${courseId}/videos`, { headers })
      ]);

      setCourseInfo(courseResponse.data);
      setChapters(chaptersResponse.data);
      setVideos(videosResponse.data);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = (videoId) => {
    confirm({
      title: 'Xác nhận xóa video',
      content: 'Bạn có chắc chắn muốn xóa video này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${baseUrl}/videos/${videoId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          message.success('Xóa video thành công');
          fetchCourseData();
        } catch (error) {
          message.error('Lỗi khi xóa video');
        }
      }
    });
  };

  const handleDeleteChapter = (chapterId) => {
    confirm({
      title: 'Xác nhận xóa chương',
      content: 'Bạn có chắc chắn muốn xóa chương này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${baseUrl}/chapters/${chapterId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          message.success('Xóa chương thành công');
          fetchCourseData();
        } catch (error) {
          message.error('Lỗi khi xóa chương');
        }
      }
    });
  };

  const handleAssignQuiz = async (videoId, quizId) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = role === 'admin' 
        ? `${baseUrl}/quizzes/${quizId}/assign`
        : `${baseUrl}/videos/${videoId}/quiz`;
      
      const method = role === 'admin' ? 'put' : 'post';
      const data = role === 'admin' 
        ? { video_id: videoId, chapter_id: videos.find(v => v.id === videoId)?.chapter_id }
        : { quiz_id: quizId };

      await axios[method](endpoint, data, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      message.success('Gán quiz thành công');
      await fetchAvailableQuizzes(videoId);
      fetchCourseData();
      return true;
    } catch (error) {
      console.error('Error assigning quiz:', error);
      message.error('Lỗi khi gán quiz');
      return false;
    }
  };

  const handleUnassignQuiz = async (videoId, quizId) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = role === 'admin'
        ? `${baseUrl}/quizzes/${quizId}/unassign`
        : `${baseUrl}/videos/${videoId}/quiz/${quizId}`;
      
      const method = role === 'admin' ? 'put' : 'delete';
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (role === 'admin') {
        await axios[method](endpoint, {
          video_id: videoId,
          chapter_id: videos.find(v => v.id === videoId)?.chapter_id
        }, config);
      } else {
        await axios[method](endpoint, config);
      }

      message.success('Hủy gán quiz thành công');
      await fetchAvailableQuizzes(videoId);
      fetchCourseData();
      return true;
    } catch (error) {
      console.error('Error unassigning quiz:', error);
      message.error('Lỗi khi hủy gán quiz');
      return false;
    }
  };

  const fetchAvailableQuizzes = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${baseUrl}/videos/${videoId}/available-quizzes`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setAvailableQuizzes(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách quiz');
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const value = {
    videos,
    chapters,
    loading,
    courseInfo,
    availableQuizzes,
    fetchCourseData,
    handleDeleteVideo,
    handleDeleteChapter,
    handleAssignQuiz,
    handleUnassignQuiz,
    fetchAvailableQuizzes,
  };

  return children(value);
};

export default VideoManagementProvider; 