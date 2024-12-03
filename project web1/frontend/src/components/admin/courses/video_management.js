import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Card, Typography, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './video_management.css';

const { Title } = Typography;

const VideoManagement = () => {
  const { courseId } = useParams();
  const [videos, setVideos] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseInfo, setCourseInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
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
  };

  const handleDeleteChapter = (chapterId) => {
    // Xử lý xóa chương
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link"
            icon={<EditOutlined />}
          />
          <Button 
            type="link"
            danger
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const getVideosByChapter = (chapterId) => {
    return videos.filter(video => video.chapter_id === chapterId);
  };

  return (
    <div className="video-management">
      <div className="page-header">
        <Title level={2}>Quản lý video - {courseInfo?.title}</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
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
                  >
                    Thêm video
                  </Button>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
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
    </div>
  );
};

export default VideoManagement;
