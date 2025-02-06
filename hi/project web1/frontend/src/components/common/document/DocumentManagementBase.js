import React from 'react';
import { Modal, Table, Button, Upload, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DocumentTableColumns from './DocumentTableColumns';

const DocumentManagementBase = ({
  visible,
  onCancel,
  documents,
  loading,
  uploadProps,
  onDownload,
  onDelete
}) => {
  const columns = DocumentTableColumns({ onDownload, onDelete });

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

export default DocumentManagementBase; 