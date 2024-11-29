import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Videos from './videos/videos';
import Menu from './menu/menu';
import './course_videos_page.css';

const CourseVideosPage = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [chaptersResponse, videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/courses/${courseId}/chapters`),
        axios.get(`http://localhost:5000/courses/${courseId}/videos`)
      ]);

      setChapters(chaptersResponse.data);
      setVideos(videosResponse.data);
      
      if (videosResponse.data.length > 0) {
        setSelectedVideo(videosResponse.data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="course-videos-container">
      <div className="menu-section">
        <Menu 
          videos={videos} 
          chapters={chapters} 
          onVideoSelect={handleVideoSelect} 
        />
      </div>
      <div className="video-section">
        {selectedVideo && <Videos video={selectedVideo} />}
      </div>
    </div>
  );
};

export default CourseVideosPage;