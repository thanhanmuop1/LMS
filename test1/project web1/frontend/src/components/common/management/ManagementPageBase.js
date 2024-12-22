import React from 'react';
import { Tabs } from 'antd';
import './management_page.css';

const ManagementPageBase = ({ items, defaultActiveKey = "1" }) => {
  return (
    <div className="management-container">
      <Tabs 
        defaultActiveKey={defaultActiveKey}
        items={items}
        type="card"
        className="management-tabs"
      />
    </div>
  );
};

export default ManagementPageBase; 