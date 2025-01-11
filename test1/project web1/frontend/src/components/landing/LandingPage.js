import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Form, Typography, Row, Col, Layout, Carousel, Menu, Drawer } from 'antd';
import {
  RocketOutlined,
  BookOutlined,
  LineChartOutlined,
  TeamOutlined,
  CloudOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  CheckOutlined,
  CloseOutlined,
  UpOutlined
} from '@ant-design/icons';
import './LandingPage.css';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

const LandingPage = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
      setShowScrollTop(offset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { key: 'features', label: 'Tính năng' },
    { key: 'pricing', label: 'Bảng giá' },
    { key: 'contact', label: 'Liên hệ' },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setVisible(false);
  };

  const onFinish = (values) => {
    console.log('Form submitted:', values);
  };

  const carouselSettings = {
    autoplay: true,
    dots: true,
    effect: 'fade',
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Layout className="landing-layout">
      <Header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo">
            <img src="/logo.png" alt="Logo" className="logo-image" />
            <span className="logo-text">EduPlatform</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="desktop-menu">
            <Menu
              mode="horizontal"
              className="transparent-menu"
              selectedKeys={[]}
            >
              {menuItems.map(item => (
                <Menu.Item key={item.key} onClick={() => scrollToSection(item.key)}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
            <div className="auth-buttons">
              <Button type="text" className="login-button">
                Đăng nhập
              </Button>
              <Button type="primary">
                Đăng ký
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            className="mobile-menu-button"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
          />
        </div>

        {/* Mobile Menu Drawer */}
        <Drawer
          title={
            <div className="logo">
              <img src="/logo.png" alt="Logo" className="logo-image" />
              <span className="logo-text">EduPlatform</span>
            </div>
          }
          placement="right"
          onClose={() => setVisible(false)}
          visible={visible}
          className="mobile-drawer"
        >
          <Menu mode="vertical">
            {menuItems.map(item => (
              <Menu.Item key={item.key} onClick={() => scrollToSection(item.key)}>
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
          <div className="auth-buttons">
            <Button type="text" block>
              Đăng nhập
            </Button>
            <Button type="primary" block>
              Đăng ký
            </Button>
          </div>
        </Drawer>
      </Header>

      <Content>
        <section className="hero-section">
          <Carousel {...carouselSettings}>
            {/* Slide 1 */}
            <div className="hero-slide slide-1">
              <div className="hero-content">
                <Title level={1} className="hero-title">
                  Nền tảng học tập trực tuyến hiện đại
                </Title>
                <Paragraph className="hero-description">
                  Giải pháp toàn diện cho việc quản lý và tổ chức học tập trực tuyến
                </Paragraph>
                <div className="hero-buttons">
                  <Button type="primary" size="large">
                    Dùng thử miễn phí
                  </Button>
                  <Button size="large" className="secondary-button">
                    Tìm hiểu thêm
                  </Button>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="hero-slide slide-2">
              <div className="hero-content">
                <Title level={1} className="hero-title">
                  Học tập không giới hạn
                </Title>
                <Paragraph className="hero-description">
                  Truy cập kho tài liệu đa dạng, học mọi lúc mọi nơi
                </Paragraph>
                <div className="hero-buttons">
                  <Button type="primary" size="large">
                    Khám phá ngay
                  </Button>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="hero-slide slide-3">
              <div className="hero-content">
                <Title level={1} className="hero-title">
                  Tương tác trực tiếp với giảng viên
                </Title>
                <Paragraph className="hero-description">
                  Hệ thống chat và video call tích hợp, hỗ trợ học tập hiệu quả
                </Paragraph>
                <div className="hero-buttons">
                  <Button type="primary" size="large">
                    Tham gia ngay
                  </Button>
                </div>
              </div>
            </div>
          </Carousel>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <Title level={2} className="section-title">
            Tính năng nổi bật
          </Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} lg={8}>
              <Card className="feature-card" bordered={false}>
                <RocketOutlined className="feature-icon" />
                <Title level={3}>Quản lý lớp học</Title>
                <Paragraph>
                  Dễ dàng tạo và quản lý các lớp học trực tuyến
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="feature-card" bordered={false}>
                <BookOutlined className="feature-icon" />
                <Title level={3}>Nội dung đa dạng</Title>
                <Paragraph>
                  Hỗ trợ nhiều định dạng học liệu khác nhau
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="feature-card" bordered={false}>
                <LineChartOutlined className="feature-icon" />
                <Title level={3}>Theo dõi tiến độ</Title>
                <Paragraph>
                  Báo cáo chi tiết về quá trình học tập
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="feature-card" bordered={false}>
                <TeamOutlined className="feature-icon" />
                <Title level={3}>Tương tác trực tiếp</Title>
                <Paragraph>
                  Trao đổi và thảo luận trực tiếp với giảng viên
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="feature-card" bordered={false}>
                <CloudOutlined className="feature-icon" />
                <Title level={3}>Lưu trữ đám mây</Title>
                <Paragraph>
                  Tài liệu được lưu trữ an toàn trên đám mây
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="feature-card" bordered={false}>
                <SafetyCertificateOutlined className="feature-icon" />
                <Title level={3}>Chứng chỉ số</Title>
                <Paragraph>
                  Cấp chứng chỉ số sau khi hoàn thành khóa học
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section">
          <Title level={2} className="section-title">
            Bảng giá
          </Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={20} md={12} lg={8}>
              <Card className="pricing-card" bordered={false}>
                <Title level={3}>Cơ bản</Title>
                <div className="price">0đ</div>
                <ul className="pricing-features">
                  <li>
                    <CheckOutlined className="feature-icon-check" /> Tối đa 3 lớp học
                  </li>
                  <li>
                    <CheckOutlined className="feature-icon-check" /> Tối đa 50 học viên
                  </li>
                  <li>
                    <CheckOutlined className="feature-icon-check" /> Hỗ trợ cơ bản
                  </li>
                  <li className="disabled">
                    <CloseOutlined className="feature-icon-close" /> Tính năng nâng cao
                  </li>
                  <li className="disabled">
                    <CloseOutlined className="feature-icon-close" /> Hỗ trợ 24/7
                  </li>
                  <li className="disabled">
                    <CloseOutlined className="feature-icon-close" /> API tích hợp
                  </li>
                </ul>
                <Button type="primary" block size="large">
                  Bắt đầu ngay
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={20} md={12} lg={8}>
              <Card className="pricing-card featured" bordered={false}>
                <Title level={3}>Chuyên nghiệp</Title>
                <div className="price">499.000đ/tháng</div>
                <ul className="pricing-features">
                  <li>
                    <CheckOutlined className="feature-icon-check" /> Không giới hạn lớp học
                  </li>
                  <li>
                    <CheckOutlined className="feature-icon-check" /> Không giới hạn học viên
                  </li>
                  <li>
                    <CheckOutlined className="feature-icon-check" /> Hỗ trợ 24/7
                  </li>
                  <li>
                    <CheckOutlined className="feature-icon-check" /> Tính năng nâng cao
                  </li>
                  <li>
                    <CheckOutlined className="feature-icon-check" /> Báo cáo chi tiết
                  </li>
                  <li>
                    <CheckOutlined className="feature-icon-check" /> API tích hợp
                  </li>
                </ul>
                <Button type="primary" block size="large">
                  Dùng thử 14 ngày
                </Button>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <Title level={2} className="section-title">
            Liên hệ với chúng tôi
          </Title>
          <Row justify="center">
            <Col xs={24} sm={20} md={16} lg={12}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="contact-form"
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input size="large" placeholder="Họ và tên" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input size="large" placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="message"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                  <TextArea
                    size="large"
                    placeholder="Nội dung"
                    rows={4}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block>
                    Gửi tin nhắn
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </section>
      </Content>

      <Footer className="landing-footer">
        <Row justify="space-between">
          <Col>
            <Title level={4}>EduPlatform</Title>
            <Paragraph>
              © 2024 EduPlatform. Tất cả quyền được bảo lưu.
            </Paragraph>
          </Col>
          <Col>
            <Button type="link">Về chúng tôi</Button>
            <Button type="link">Điều khoản</Button>
            <Button type="link">Chính sách</Button>
          </Col>
        </Row>
      </Footer>

      <div 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        <UpOutlined />
      </div>
    </Layout>
  );
};

export default LandingPage; 