import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Button, Space, message, Upload, Spin } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const DocumentManagement = ({ visible, onCancel, courseId, chapterId, videoId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!visible) return; // Không fetch nếu modal không hiển thị
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/documents`, {
        params: {
          courseId,
          chapterId,
          videoId
        }
      });
      setDocuments(response.data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  }, [courseId, chapterId, videoId, visible]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (documentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      message.success('Xóa tài liệu thành công');
      fetchDocuments();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa tài liệu');
    }
  };

  const handleDownload = async (document) => {
    try {
      window.open(`http://localhost:5000/documents/${document.id}/download`, '_blank');
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải tài liệu');
    }
  };

  const uploadProps = {
    name: 'file',
    action: 'http://localhost:5000/documents',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: {
      courseId,
      chapterId,
      videoId,
      title: '', // Sẽ được cập nhật trong onBeforeUpload
    },
    beforeUpload: (file) => {
      const isValidType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/jpeg',
        'application/png',
        'application/jpg'
      ].includes(file.type);
      
      if (!isValidType) {
        message.error('Chỉ chấp nhận file PDF, Word, JPEG, PNG, JPG!');
        return false;
      }

      // Cập nhật title từ tên file
      uploadProps.data.title = file.name;
      return true;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} tải lên thành công`);
        fetchDocuments();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại`);
      }
    },
  };

  const columns = [
    {
      title: 'Tên tài liệu',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Loại file',
      dataIndex: 'file_type',
      key: 'file_type',
      render: (text) => text.toUpperCase(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleDownload(record)}>
            Tải xuống
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Quản lý tài liệu"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
        </Upload>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={documents}
          rowKey="id"
        />
      </Spin>
    </Modal>
  );
};

export default DocumentManagement; 