import React from 'react';
import { Card, Typography, Button, Tag } from 'antd';
import { BookOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getImageUrl } from '../../../../utils/imageConfig';

const { Text } = Typography;
const { Meta } = Card;

const SchoolCard = ({ school, loading, onDelete, onEdit }) => {
  return (
    <Card
      hoverable
      loading={loading}
      className="school-card"
      cover={
        school.logo ? (
          <img
            alt={school.name}
            src={getImageUrl(school.logo)}
            className="school-logo"
          />
        ) : (
          <div className="school-logo-placeholder">
            <BookOutlined className="placeholder-icon" />
          </div>
        )
      }
      actions={[
        <div className="school-card-actions">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="icon-button"
            onClick={() => onEdit(school)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(school.id)}
            className="icon-button danger"
          />
        </div>
      ]}
    >
      <Meta
        title={<Text strong className="school-name">{school.name}</Text>}
        description={
          <Tag color="blue" className="school-domain">
            {school.domain}.yourdomain.com
          </Tag>
        }
      />
    </Card>
  );
};

export default SchoolCard; 