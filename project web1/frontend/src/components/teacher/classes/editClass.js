import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, message, Select, Upload } from 'antd';
import axios from 'axios';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditClass = ({ visible, onCancel, onSuccess, classData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        if (classData) {
            const hasValidPassword = classData.password && classData.password !== '0' && classData.password !== 0;
            
            form.setFieldsValue({
                name: classData.name,
                description: classData.description,
                max_students: classData.max_students,
                status: classData.status,
                password: hasValidPassword ? classData.password : undefined
            });
            
            setRequiresPassword(hasValidPassword);
            setImageUrl(classData.thumbnail || '');
        }
    }, [classData, form]);

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên file ảnh!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Ảnh phải nhỏ hơn 5MB!');
        }
        return isImage && isLt5M;
    };

    const handleUpload = async (options) => {
        const { onSuccess, onError, file } = options;
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('thumbnail', file);

        try {
            setUploadLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/teacher/classes/upload-thumbnail`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setImageUrl(response.data.url);
            onSuccess('Ok');
            message.success('Tải ảnh lên thành công!');
        } catch (err) {
            onError({ err });
            message.error('Tải ảnh lên thất bại.');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/teacher/classes/${classData.id}`,
                {
                    ...values,
                    requires_password: requiresPassword,
                    password: requiresPassword ? values.password : null,
                    thumbnail: imageUrl
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                message.success('Cập nhật lớp học thành công');
                onSuccess();
                onCancel();
            }
        } catch (error) {
            console.error('Error updating class:', error);
            message.error('Không thể cập nhật lớp học');
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    return (
        <Modal
            title="Chỉnh sửa lớp học"
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Cập nhật"
            cancelText="Hủy"
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="Tên lớp học"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên lớp học' },
                        { max: 255, message: 'Tên lớp học không được quá 255 ký tự' }
                    ]}
                >
                    <Input placeholder="Nhập tên lớp học" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <Input.TextArea 
                        placeholder="Nhập mô tả về lớp học" 
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    name="max_students"
                    label="Số học viên tối đa"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số học viên tối đa' }
                    ]}
                >
                    <InputNumber
                        min={1}
                        max={1000}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[
                        { required: true, message: 'Vui lòng chọn trạng thái lớp học' }
                    ]}
                >
                    <Select>
                        <Option value="active">Đang hoạt động</Option>
                        <Option value="inactive">Tạm khóa</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Yêu cầu mật khẩu để tham gia"
                >
                    <Switch
                        checked={requiresPassword}
                        onChange={(checked) => {
                            setRequiresPassword(checked);
                            if (!checked) {
                                form.setFieldValue('password', undefined);
                            }
                        }}
                    />
                </Form.Item>

                {requiresPassword && (
                    <Form.Item
                        name="password"
                        label="Mật khẩu lớp học"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu cho lớp học' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu cho lớp học" />
                    </Form.Item>
                )}

                <Form.Item
                    label="Ảnh đại diện"
                    extra="Hỗ trợ JPG, PNG, GIF (< 5MB)"
                >
                    <Upload
                        name="thumbnail"
                        listType="picture-card"
                        showUploadList={false}
                        customRequest={handleUpload}
                        beforeUpload={beforeUpload}
                    >
                        {imageUrl ? (
                            <img 
                                src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
                                alt="thumbnail" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : uploadButton}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditClass;
