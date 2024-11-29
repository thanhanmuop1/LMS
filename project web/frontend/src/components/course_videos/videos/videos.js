import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './videos.css';

const Videos = ({ video }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Fetch video progress when video changes
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/videos/${video.id}/progress`);
        setCompleted(response.data.completed);
      } catch (error) {
        console.error('Error fetching video progress:', error);
      }
    };
    fetchProgress();
  }, [video.id]);

  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleVideoEnd = async () => {
    try {
      await axios.post(`http://localhost:5000/videos/${video.id}/progress`, {
        completed: true
      });
      setCompleted(true);
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  };

  return (
    <div className="video-container">
      <h2>{video.title}</h2>
      <div className="video-wrapper">
        <iframe
          src={getEmbedUrl(video.video_url)}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onEnded={handleVideoEnd}
        />
      </div>
      {completed && (
        <div className="video-completed">
          <span className="completed-badge">✓ Đã xem</span>
        </div>
      )}
    </div>
  );
};

export default Videos;
