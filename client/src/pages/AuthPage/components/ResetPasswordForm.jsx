
import PropTypes from "prop-types";
import { Form, Input, Button, Card, Typography } from "antd";
import { LockOutlined, SendOutlined } from "@ant-design/icons";

const { Title } = Typography;

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

ResetPasswordForm.defaultProps = {
  onSubmit: null,
  loading: false,
};

function ResetPasswordForm(props) {
  const { onSubmit, loading } = props;
  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  return (
    <Card className="wrapper">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={2}>Reset password</Title>
      </div>

      <Form
        name="normal_reset_pass"
        className="reset-pass-form"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Form.Item
          name="newPassword"
          hasFeedback
          rules={[
            { required: true, message: "Please input your new password!" },
            {
              pattern: new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
              ),
              message:
                "Password must contain at least one lowercase letter, uppercase letter, number, and special character",
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Enter your new password"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The confirm password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Enter your confirm password"
            disabled={loading}
          />
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
            <SendOutlined />
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default ResetPasswordForm;
