import React, { useEffect, useState } from 'react';
import { Menu as AntMenu } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, ReadOutlined, FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import './menu.css';

const Menu = ({ videos, chapters, quizzes, onVideoSelect, onQuizSelect }) => {
  const [watchedVideos, setWatchedVideos] = useState([]);

  useEffect(() => {
    const fetchWatchedVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/videos/completed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchedVideos(response.data.map(v => v.video_id));
      } catch (error) {
        console.error('Error fetching watched videos:', error);
      }
    };

    fetchWatchedVideos();
    window.addEventListener('videoCompleted', fetchWatchedVideos);
    return () => window.removeEventListener('videoCompleted', fetchWatchedVideos);
  }, []);

  const getMenuItems = () => {
    return chapters.map(chapter => {
      const chapterVideos = videos.filter(video => video.chapter_id === chapter.id);
      const children = [];

      chapterVideos.forEach(video => {
        const isWatched = watchedVideos.includes(video.id);
        
        children.push({
          key: `video-${video.id}`,
          icon: isWatched ? <CheckCircleOutlined className="watched-icon" /> : <PlayCircleOutlined />,
          label: video.title,
          onClick: () => onVideoSelect(video),
          className: isWatched ? 'video-watched' : ''
        });

        const videoQuiz = quizzes.find(quiz => quiz.video_id === video.id);
        if (videoQuiz) {
          children.push({
            key: `quiz-${videoQuiz.id}`,
            icon: <FileTextOutlined style={{ color: '#52c41a' }} />,
            label: `Quiz: ${videoQuiz.title || 'Bài kiểm tra'}`,
            className: 'quiz-menu-item',
            onClick: () => onQuizSelect(videoQuiz)
          });
        }
      });

      return {
        key: `chapter-${chapter.id}`,
        icon: <ReadOutlined />,
        label: chapter.title,
        children: children
      };
    });
  };

  return (
    <div className="menu-container">
      <h2 className="menu-title">Danh sách bài học</h2>
      <AntMenu
        mode="inline"
        className="video-menu"
        defaultOpenKeys={[`chapter-1`]}
        items={getMenuItems()}
      />
    </div>
  );
};

export default Menu;