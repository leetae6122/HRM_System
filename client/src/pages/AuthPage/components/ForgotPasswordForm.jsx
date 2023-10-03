/* eslint-disable no-template-curly-in-string */

import PropTypes from "prop-types";
import { Form, Input, Button, Card, Typography, Row, Col } from "antd";
import { UserOutlined, MailOutlined, RollbackOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

ForgotPasswordForm.defaultProps = {
  onSubmit: null,
  loading: false,
};

function ForgotPasswordForm(props) {
  const { onSubmit, loading } = props;
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    email: "",
  };

  const validateMessages = {
    required: "Please input your ${label}!",
    types: {
      email: "${label} is not a valid email!",
    },
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Card className="wrapper">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={2}>Forgot Password</Title>
      </div>

      <Form
        name="normal_forgot_pass"
        className="forgot-pass-form"
        initialValues={initialValues}
        onFinish={onSubmit}
        validateMessages={validateMessages}
      >
        <Form.Item hasFeedback name="username" rules={[{ required: true }]}>
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter your username"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          name="email"
          hasFeedback
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Enter your email"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item>
          <Row justify={"space-between"}>
            <Col span={11}>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-form-button"
                block
                style={{
                  height: "auto",
                  fontSize: 16,
                  fontWeight: "bolder",
                }}
                loading={loading}
              >
                <SendOutlined />
                Submit
              </Button>
            </Col>
            <Col span={11}>
              <Button
                type="default"
                htmlType="reset"
                className="reset-form-button"
                block
                style={{
                  height: "auto",
                  fontSize: 16,
                  fontWeight: "bolder",
                }}
                loading={loading}
                onClick={handleBack}
              >
                <RollbackOutlined />
                Back
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default ForgotPasswordForm;
