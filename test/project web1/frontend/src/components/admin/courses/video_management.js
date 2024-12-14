import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message, Card, Typography, Tooltip, Modal, Spin, List, Empty, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './video_management.css';
import AddChapter from './manage_chapter/add_chapter';
import EditChapter from './manage_chapter/edit_chapter';
import AddVideo from './manage_video/add_video';
import EditVideo from './manage_video/edit_video';
import DocumentManagement from './manage_document/document_management';

const { Title } = Typography;
const { confirm } = Modal;

const VideoManagement = () => {
  const { courseId } = useParams();
  const [videos, setVideos] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);
  const [isAddChapterVisible, setIsAddChapterVisible] = useState(false);
  const [isEditChapterVisible, setIsEditChapterVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isAddVideoVisible, setIsAddVideoVisible] = useState(false);
  const [isEditVideoVisible, setIsEditVideoVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedChapterForVideo, setSelectedChapterForVideo] = useState(null);
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [selectedVideoForDocs, setSelectedVideoForDocs] = useState(null);
  const [isAssignQuizVisible, setIsAssignQuizVisible] = useState(false);
  const [selectedVideoForQuiz, setSelectedVideoForQuiz] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [videosResponse, courseResponse, chaptersResponse] = await Promise.all([
        axios.get(`http://localhost:5000/courses/${courseId}/videos`),
        axios.get(`http://localhost:5000/courses/${courseId}`),
        axios.get(`http://localhost:5000/courses/${courseId}/chapters`)
      ]);
      setVideos(videosResponse.data);
      setCourseInfo(courseResponse.data);
      setChapters(chaptersResponse.data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddChapter = () => {
    setIsAddChapterVisible(true);
  };

  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setIsEditChapterVisible(true);
  };

  const handleDeleteChapter = (chapterId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa chương này?',
      content: 'Tất cả video trong chương này sẽ bị xóa. Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/chapters/${chapterId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          message.success('Xóa chương thành công');
          fetchData();
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa chương');
        }
      },
    });
  };

  const handleChapterSuccess = () => {
    setIsAddChapterVisible(false);
    setIsEditChapterVisible(false);
    setSelectedChapter(null);
    fetchData();
  };

  const handleAddVideo = (chapter) => {
    setSelectedChapterForVideo(chapter);
    setIsAddVideoVisible(true);
  };

  const handleEditVideo = (video) => {
    setSelectedVideo(video);
    setIsEditVideoVisible(true);
  };

  const handleDeleteVideo = (videoId) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa video này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/videos/${videoId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          message.success('Xóa video thành công');
          fetchData();
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa video');
        }
      },
    });
  };

  const handleVideoSuccess = () => {
    setIsAddVideoVisible(false);
    setIsEditVideoVisible(false);
    setSelectedVideo(null);
    setSelectedChapterForVideo(null);
    fetchData();
  };

  const handleManageDocuments = (video) => {
    setSelectedVideoForDocs(video);
    setIsDocumentModalVisible(true);
  };

  const fetchAvailableQuizzes = useCallback(async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/videos/${videoId}/quizzes`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setAvailableQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      message.error('Có lỗi xảy ra khi tải danh sách quiz');
    }
  }, []);

  const handleAssignQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/quizzes/${quizId}/assign`,
        {
          video_id: selectedVideoForQuiz.id,
          chapter_id: selectedVideoForQuiz.chapter_id
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      message.success('Gán quiz thành công');
      setIsAssignQuizVisible(false);
      setSelectedVideoForQuiz(null);
      fetchData();
    } catch (error) {
      console.error('Error assigning quiz:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi gán quiz');
    }
  };

  const handleUnassignQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/quizzes/${quizId}/unassign`,
        {
          video_id: selectedVideoForQuiz.id,
          chapter_id: selectedVideoForQuiz.chapter_id
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      message.success('Hủy gán quiz thành công');
      setIsAssignQuizVisible(false);
      setSelectedVideoForQuiz(null);
      fetchData();
    } catch (error) {
      console.error('Error unassigning quiz:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi hủy gán quiz');
    }
  };

  const videoColumns = [
    {
      title: 'Tên video',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'URL Video',
      dataIndex: 'video_url',
      key: 'video_url',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space>
          <Button 
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditVideo(record)}
          />
          <Button 
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteVideo(record.id)}
          />
          <Button
            type="link"
            onClick={() => handleManageDocuments(record)}
          >
            Tài liệu
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setSelectedVideoForQuiz(record);
              setIsAssignQuizVisible(true);
              fetchAvailableQuizzes(record.id);
            }}
          >
            Gán Quiz
          </Button>
        </Space>
      ),
    },
  ];

  const getVideosByChapter = (chapterId) => {
    return videos.filter(video => video.chapter_id === chapterId);
  };

  return (
    <div className="video-management">
      <Spin spinning={loading}>
        <div className="page-header">
          <Title level={2}>Quản lý video - {courseInfo?.title}</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddChapter}
          >
            Thêm chương mới
          </Button>
        </div>

        <div className="chapters-container">
          {chapters.map(chapter => (
            <Card 
              key={chapter.id}
              className="chapter-card"
              title={
                <div className="chapter-header">
                  <span>{chapter.title}</span>
                  <Space>
                    <Button
                      type="primary"
                      icon={<VideoCameraAddOutlined />}
                      size="small"
                      onClick={() => handleAddVideo(chapter)}
                    >
                      Thêm video
                    </Button>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleEditChapter(chapter)}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleDeleteChapter(chapter.id)}
                    />
                  </Space>
                </div>
              }
            >
              <Table 
                columns={videoColumns} 
                dataSource={getVideosByChapter(chapter.id)}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </Card>
          ))}
        </div>

        <AddChapter
          visible={isAddChapterVisible}
          onCancel={() => setIsAddChapterVisible(false)}
          onSuccess={handleChapterSuccess}
          courseId={courseId}
        />

        <EditChapter
          visible={isEditChapterVisible}
          onCancel={() => {
            setIsEditChapterVisible(false);
            setSelectedChapter(null);
          }}
          onSuccess={handleChapterSuccess}
          chapterData={selectedChapter}
        />

        <AddVideo
          visible={isAddVideoVisible}
          onCancel={() => {
            setIsAddVideoVisible(false);
            setSelectedChapterForVideo(null);
          }}
          onSuccess={handleVideoSuccess}
          courseId={courseId}
          chapterId={selectedChapterForVideo?.id}
        />

        <EditVideo
          visible={isEditVideoVisible}
          onCancel={() => {
            setIsEditVideoVisible(false);
            setSelectedVideo(null);
          }}
          onSuccess={handleVideoSuccess}
          videoData={selectedVideo}
        />

        <DocumentManagement
          visible={isDocumentModalVisible}
          onCancel={() => {
            setIsDocumentModalVisible(false);
            setSelectedVideoForDocs(null);
          }}
          courseId={courseId}
          chapterId={selectedVideoForDocs?.chapter_id}
          videoId={selectedVideoForDocs?.id}
        />

        <Modal
          title={`Quản lý Quiz cho Video: ${selectedVideoForQuiz?.title || ''}`}
          open={isAssignQuizVisible}
          onCancel={() => {
            setIsAssignQuizVisible(false);
            setSelectedVideoForQuiz(null);
            setAvailableQuizzes([]);
          }}
          footer={null}
          width={800}
        >
          {availableQuizzes.length === 0 ? (
            <Empty 
              description={
                <span>
                  Không có quiz nào khả dụng. 
                  <br />
                  <Button 
                    type="link" 
                    onClick={() => {
                      setIsAssignQuizVisible(false);
                      window.location.href = '/admin?tab=3';
                    }}
                  >
                    Tạo quiz mới
                  </Button>
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          ) : (
            <List
              dataSource={availableQuizzes}
              renderItem={quiz => (
                <List.Item
                  actions={[
                    quiz.is_assigned ? (
                      <Button
                        type="primary"
                        danger
                        onClick={() => handleUnassignQuiz(quiz.id)}
                      >
                        Hủy gán
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => handleAssignQuiz(quiz.id)}
                      >
                        Gán
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {quiz.title}
                        {quiz.is_assigned && (
                          <Tag color="green">Đã gán</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <Space direction="vertical">
                        <span>Loại: Quiz video</span>
                        <span>Thời gian: {quiz.duration_minutes} phút</span>
                        <span>Điểm đạt: {quiz.passing_score}%</span>
                        <span>Số câu hỏi: {quiz.question_count}</span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Modal>
      </Spin>
    </div>
  );
};

export default VideoManagement;
