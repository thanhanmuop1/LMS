import React from 'react';
import { Menu as AntMenu } from 'antd';
import { PlayCircleOutlined, FolderOutlined } from '@ant-design/icons';
import './menu.css';

const Menu = ({ videos, chapters, onVideoSelect }) => { // videos = [], chapters = [] trong đó =[] để tránh lỗi ko có gì
  // Nhóm video theo chapter
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

  // Tạo menu items
  const getMenuItems = () => {
    const videosByChapter = getVideosByChapter();
    
    return chapters.map(chapter => ({
      key: `chapter-${chapter.id}`,
      icon: <FolderOutlined />,
      label: chapter.title,
      children: videosByChapter[chapter.id]?.map((video, index) => ({
        key: video.id,
        icon: <PlayCircleOutlined />,
        label: (
          <div className="video-menu-item">
            <div className="video-title">
              {`${index + 1}. ${video.title}`}
            </div>
          </div>
        ),
        onClick: () => onVideoSelect(video)
      })) || []
    }));
  };

  return (
    <div className="menu-container">
      <h2 className="menu-title">Danh sách bài học</h2>
      <AntMenu
        mode="inline"
        className="video-menu"
        defaultOpenKeys={[`chapter-1`]} // Mặc định mở chapter đầu tiên
        items={getMenuItems()}
      />
    </div>
  );
};

export default Menu;