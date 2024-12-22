import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Quiz from '../quiz/Quiz';
import './videos.css';

const Videos = ({ video, quizzes }) => {
  const [player, setPlayer] = useState(null);
  const [isAPIReady, setIsAPIReady] = useState(false);

  // Hàm lấy videoId từ URL YouTube
  const getVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'www.youtube.com' && urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      } else if (urlObj.hostname === 'www.youtube.com' && urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/embed/')[1];
      }
    } catch (error) {
      console.error('Invalid YouTube URL:', error);
    }
    return null;
  };

  // Tải YouTube API nếu chưa có
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API is ready');
        setIsAPIReady(true);
      };
    } else {
      setIsAPIReady(true);
    }

    return () => {
      if (player) player.destroy();
    };
  }, [player]);

  // Tải video khi API sẵn sàng hoặc URL video thay đổi
  useEffect(() => {
    if (!isAPIReady || !video?.video_url) return;

    const videoId = getVideoId(video.video_url);
    if (!videoId) {
      console.warn('Video ID not found for URL:', video.video_url);
      return;
    }

    if (player) {
      player.destroy();
      setPlayer(null);
    }

    const newPlayer = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onStateChange: async (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            console.log('Video ended');
            try {
              const token = localStorage.getItem('token');
              await axios.post(
                `http://localhost:5000/videos/${video.id}/mark-watched`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              console.log('Video marked as watched');
              window.dispatchEvent(new Event('videoCompleted'));
            } catch (error) {
              console.error('Error marking video as watched:', error);
            }
          }
        },
      },
    });

    setPlayer(newPlayer);
  }, [video.video_url, isAPIReady]);

  return (
    <div className="video-container">
      <div className="video-section">
        <h2>{video.title}</h2>
        <div className="video-wrapper">
          <div id="youtube-player"></div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
