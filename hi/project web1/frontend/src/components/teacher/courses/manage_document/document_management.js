import React, { useState, useEffect, useCallback } from 'react';
import { message, Modal } from 'antd';
import axiosConfig from '../../../../utils/axiosConfig';
import DocumentManagementBase from '../../../common/document/DocumentManagementBase';

const DocumentManagement = ({ visible, onCancel, courseId, chapterId, videoId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!visible) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axiosConfig.get(`/teacher/courses/${courseId}/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: { courseId, chapterId, videoId }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
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
      Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        async onOk() {
          await axiosConfig.delete(`/documents/${documentId}`);
          message.success('Xóa tài liệu thành công');
          fetchDocuments();
        }
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      message.error('Có lỗi xảy ra khi xóa tài liệu');
    }
  };

  const handleDownload = async (document) => {
    try {
      const token = localStorage.getItem('token');
      window.open(`${axiosConfig.defaults.baseURL}/documents/${document.id}/download`, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
      message.error('Có lỗi xảy ra khi tải tài liệu');
    }
  };

  const uploadProps = {
    name: 'file',
    action: `${axiosConfig.defaults.baseURL}/documents`,
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
        'image/jpeg',
        'image/png',
        'image/jpg'
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
        message.error(`${info.file.name} tải lên thất bại.`);
        console.error('Upload error:', info.file.error);
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