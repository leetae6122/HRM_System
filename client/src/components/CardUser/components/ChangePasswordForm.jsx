
import PropTypes from "prop-types";
import { Form, Input, Button, Space } from "antd";
import { LockOutlined } from "@ant-design/icons";

ChangePasswordForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

ChangePasswordForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
};

function ChangePasswordForm(props) {
  const { onCancel, onSubmit, loading } = props;
  const [form] = Form.useForm();
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_change_pass"
      className="change-pass-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
    >
      <Form.Item
        name="currentPassword"
        hasFeedback
        rules={[
          { required: true, message: "Please input your current password!" },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Enter your current password"
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="newPassword"
        hasFeedback
        rules={[
          { required: true, message: "Please input your new password!" },
          { min: 8, message: 'New Password must be minimum 8 characters.' },
          {
            pattern: new RegExp(
              "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
            ),
            message:
              "Password must contain at least one lowercase letter, uppercase letter, number, and special character",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("currentPassword") !== value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password must be different from the current password!")
              );
            },
          }),
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
                new Error("The new password that you entered do not match!")
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
        <Space style={{ float: "right" }}>
          <Button htmlType="button" onClick={handleCancel} loading={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default ChangePasswordForm;
