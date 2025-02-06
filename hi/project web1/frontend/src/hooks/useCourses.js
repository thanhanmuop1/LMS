import { useState, useEffect } from 'react';
import { message } from 'antd';
import axiosConfig from '../utils/axiosConfig';

export const useCourses = (fetchUrl) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, [fetchUrl]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosConfig.get(fetchUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Không thể tải danh sách khóa học');
      message.error('Có lỗi xảy ra khi tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, error, refetchCourses: fetchCourses };
}; 