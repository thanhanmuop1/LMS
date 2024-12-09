import React from 'react';
import './videos.css';

const Videos = ({ video }) => {
  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="video-container">
      <div className="content-wrapper">
        <div className="video-section">
          <h2>{video.title}</h2>
          <div className="video-wrapper">
            <iframe
              src={getEmbedUrl(video.video_url)}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
