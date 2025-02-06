import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import axiosConfig from '../../../utils/axiosConfig';

const { confirm } = Modal;

const VideoManagementProvider = ({
  courseId,
  role = 'teacher',
  children
}) => {
  const [videos, setVideos] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const [courseResponse, chaptersResponse, videosResponse] = await Promise.all([
        axiosConfig.get(`/courses/${courseId}`),
        axiosConfig.get(`/courses/${courseId}/chapters`),
        axiosConfig.get(`/courses/${courseId}/videos`)
      ]);

      setCourseInfo(courseResponse.data);
      setChapters(chaptersResponse.data);
      setVideos(videosResponse.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
      message.error('Không thể tải dữ liệu khóa học');
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
          await axiosConfig.delete(`/videos/${videoId}`);
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
          await axiosConfig.delete(`/chapters/${chapterId}`);
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
      const chapterId = videos.find(v => v.id === videoId)?.chapter_id;
      await axiosConfig.put(`/quizzes/${quizId}/assign`, {
        video_id: videoId,
        chapter_id: chapterId
      });
      message.success('Gán quiz thành công');
      await fetchAvailableQuizzes(videoId);
      fetchCourseData();
      return true;
    } catch (error) {
      message.error('Lỗi khi gán quiz');
      return false;
    }
  };

  const handleUnassignQuiz = async (videoId, quizId) => {
    try {
      const chapterId = videos.find(v => v.id === videoId)?.chapter_id;
      await axiosConfig.put(`/quizzes/${quizId}/unassign`, {
        video_id: videoId,
        chapter_id: chapterId
      });
      message.success('Hủy gán quiz thành công');
      await fetchAvailableQuizzes(videoId);
      fetchCourseData();
      return true;
    } catch (error) {
      message.error('Lỗi khi hủy gán quiz');
      return false;
    }
  };

  const fetchAvailableQuizzes = async (videoId) => {
    try {
      const response = await axiosConfig.get(`/videos/${videoId}/available-quizzes`);
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