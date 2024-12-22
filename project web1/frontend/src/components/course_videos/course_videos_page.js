import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Videos from './videos/videos';
import Menu from './menu/menu';
import Quiz from './quiz/Quiz';
import CourseVideoNavbar from './components/CourseVideoNavbar';
import './course_videos_page.css';
import { message, List } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const CourseVideosPage = () => {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseInfo, setCourseInfo] = useState(null);

  const fetchDocuments = useCallback(async (videoId, chapterId) => {
    try {
      const response = await axios.get(`http://localhost:5000/documents`, {
        params: {
          courseId,
          chapterId,
          videoId
        }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      message.error('Có lỗi xảy ra khi tải danh sách tài liệu');
    }
  }, [courseId]);

  const fetchData = useCallback(async () => {
    try {
      const [chaptersResponse, videosResponse, quizzesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/courses/${courseId}/chapters`),
        axios.get(`http://localhost:5000/courses/${courseId}/videos`),
        axios.get(`http://localhost:5000/courses/${courseId}/quizzes`)
      ]);

      setChapters(chaptersResponse.data);
      setVideos(videosResponse.data);
      setQuizzes(quizzesResponse.data);
      
      if (videosResponse.data.length > 0) {
        const firstVideo = videosResponse.data[0];
        setSelectedVideo(firstVideo);
        fetchDocuments(firstVideo.id, firstVideo.chapter_id);
        setSelectedQuiz(null);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
    }
  }, [courseId, fetchDocuments]);

  const fetchCourseInfo = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${courseId}`);
      setCourseInfo(response.data);
    } catch (error) {
      console.error('Error fetching course info:', error);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseInfo();
    fetchData();
  }, [fetchCourseInfo, fetchData]);

  const handleVideoSelect = (video) => {
    console.log('Selected video:', video);
    setSelectedVideo(video);
    setSelectedQuiz(null);
    fetchDocuments(video.id, video.chapter_id);
  };

  const handleQuizSelect = (quiz) => {
    console.log('Selected quiz:', quiz);
    if (quiz && quiz.id) {
      setSelectedQuiz(quiz);
      setSelectedVideo(null);
    } else {
      message.error('Không thể tải bài kiểm tra');
    }
  };

  const handleDownload = async (document) => {
    try {
      window.open(`http://localhost:5000/documents/${document.id}/download`, '_blank');
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải tài liệu');
    }
  };

  if (loading) return (<div className="loading-icon"><LoadingOutlined /></div>);
  if (error) return <div>{error}</div>;

  return (
    <div className="course-page-layout">
      <CourseVideoNavbar courseTitle={courseInfo?.title} />
      <div className="course-videos-container">
        <div className="menu-section">
          <Menu
            videos={videos}
            chapters={chapters}
            quizzes={quizzes}
            onVideoSelect={handleVideoSelect}
            onQuizSelect={handleQuizSelect}
          />
        </div>
        <div className="content-section">
          {selectedVideo && (
            <>
              <Videos 
                video={selectedVideo} 
                quizzes={quizzes.filter(q => 
                  q.video_id === selectedVideo.id || 
                  (q.chapter_id === selectedVideo.chapter_id && q.quiz_type === 'chapter')
                )} 
              />
              {documents.length > 0 && (
                <div className="documents-section">
                  <h3>Tài liệu</h3>
                  <List
                    size="small"
                    dataSource={documents}
                    renderItem={doc => (
                      <List.Item
                        className="document-item"
                        onClick={() => handleDownload(doc)}
                      >
                        <List.Item.Meta
                          title={
                            <span className="document-title">
                              {doc.title}
                              <span className="document-type">
                                ({doc.file_type.toUpperCase()})
                              </span>
                            </span>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </>
          )}
          {selectedQuiz && Object.keys(selectedQuiz).length > 0 && (
            <Quiz quiz={selectedQuiz} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseVideosPage;