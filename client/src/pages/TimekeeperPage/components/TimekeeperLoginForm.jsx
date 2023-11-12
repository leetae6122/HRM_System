import PropTypes from 'prop-types';
import { Form, Input, Button, Row, Col } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

TimekeeperLoginForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

TimekeeperLoginForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    employeeId: '',
  },
};

function TimekeeperLoginForm(props) {
  const { onSubmit, loading, initialValues } = props;
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="normal_timekeeper_login"
      className="timekeeper-login-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      size="large"
      style={{
        width: '80vh',
      }}
    >
      <Row>
        <Col span={15}>
          <Form.Item
            name="employeeId"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input Employee Id!',
              },
            ]}
          >
            <Input
              placeholder="Enter Employee Id"
              disabled={loading}
              maxLength={10}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', marginLeft: 10 }}
              icon={<LoginOutlined/>}
            >
              Login
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default TimekeeperLoginForm;
