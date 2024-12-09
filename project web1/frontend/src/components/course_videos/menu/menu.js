import React from 'react';
import { Menu as AntMenu, Tooltip } from 'antd';
import { PlayCircleOutlined, FolderOutlined, FileTextOutlined } from '@ant-design/icons';
import './menu.css';

const Menu = ({ videos, chapters, quizzes, onVideoSelect, onQuizSelect }) => {
  const getVideosByChapter = () => {
    const videosByChapter = {};
    videos.forEach(video => {
      if (!videosByChapter[video.chapter_id]) {
        videosByChapter[video.chapter_id] = [];
      }
      videosByChapter[video.chapter_id].push(video);
    });
    return videosByChapter;
  };

  const getQuizzesByChapter = () => {
    const quizzesByChapter = {};
    quizzes.forEach(quiz => {
      if (!quizzesByChapter[quiz.chapter_id]) {
        quizzesByChapter[quiz.chapter_id] = [];
      }
      quizzesByChapter[quiz.chapter_id].push(quiz);
    });
    return quizzesByChapter;
  };

  const getMenuItems = () => {
    const videosByChapter = getVideosByChapter();
    const quizzesByChapter = getQuizzesByChapter();
    
    return chapters.map(chapter => ({
      key: `chapter-${chapter.id}`,
      icon: <FolderOutlined />,
      label: chapter.title,
      children: [
        ...(videosByChapter[chapter.id]?.map((video, index) => ({
          key: `video-${video.id}`,
          icon: <PlayCircleOutlined />,
          label: (
            <Tooltip title={`${index + 1}. ${video.title}`} placement="right">
              <div className="video-menu-item">
                <div className="video-title">
                  {`${index + 1}. ${video.title}`}
                </div>
              </div>
            </Tooltip>
          ),
          onClick: () => onVideoSelect(video)
        })) || []),
        ...(quizzesByChapter[chapter.id]?.map((quiz, index) => ({
          key: `quiz-${quiz.id}`,
          icon: <FileTextOutlined />,
          label: (
            <Tooltip title={quiz.title} placement="right">
              <div className="quiz-menu-item">
                <div className="quiz-title">{quiz.title}</div>
              </div>
            </Tooltip>
          ),
          onClick: () => onQuizSelect(quiz)
        })) || [])
      ]
    }));
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