
import PropTypes from "prop-types";
import { Form, Input, Button, Checkbox, Card, Typography } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

LoginForm.defaultProps = {
  onSubmit: null,
  loading: false,
};

function LoginForm(props) {
  const { onSubmit, loading } = props;
  const initialValues = {
    username: "",
    password: "",
    isRemember: false,
  };

  return (
    <Card className="wrapper">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={1}>Login</Title>
      </div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Form.Item
          name="username"
          hasFeedback
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter your username"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Enter your password"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item style={{ marginInline: "10px" }}>
          <Form.Item name="isRemember" valuePropName="checked" noStyle>
            <Checkbox disabled={loading}>Remember me</Checkbox>
          </Form.Item>
          <Link
            to="/auth/forgot-password"
            style={{ float: "right" }}
            className="login-form-forgot"
            disabled={loading}
          >
            Forgot password?
          </Link>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-form-button"
            block
            style={{ height: "auto", fontSize: 18, fontWeight: "bolder" }}
            loading={loading}
          >
            <LoginOutlined />
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default LoginForm;
