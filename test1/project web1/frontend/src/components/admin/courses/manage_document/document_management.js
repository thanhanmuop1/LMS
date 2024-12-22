import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import DocumentManagementBase from '../../../common/course/DocumentManagementBase';

const DocumentManagement = ({ visible, onCancel, courseId, chapterId, videoId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!visible) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/documents`, {
        params: { courseId, chapterId, videoId }
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
        headers: { 'Authorization': `Bearer ${token}` }
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
      title: '',
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

  return (
    <DocumentManagementBase
      visible={visible}
      onCancel={onCancel}
      documents={documents}
      loading={loading}
      uploadProps={uploadProps}
      onDownload={handleDownload}
      onDelete={handleDelete}
    />
  );
};

export default DocumentManagement; 