import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, message, Card, Typography, Tooltip, Modal, Spin } from 'antd';
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
      width: 200,
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
      </Spin>
    </div>
  );
};

export default VideoManagement;
