import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, DatePicker, Select, Col, Row } from 'antd';
import _ from 'lodash';

EditProfileForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

EditProfileForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {},
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function EditProfileForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        const defaultValues = {
          phoneNumber: initialValues.phoneNumber,
          dateBirth: initialValues.dateBirth,
          address: initialValues.address,
        };
        if (!_.isEqual(defaultValues, values)) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
      },
      () => setSubmittable(false),
    );
  }, [values, form, initialValues]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_edit_profile"
      className="edit_profile-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{
        maxWidth: 600,
      }}
      size="large"
    >
      <Row>
        <Col span={12}>
          <Form.Item label="First Name">
            <Input
              placeholder="Enter your first name"
              disabled={true}
              value={initialValues.firstName}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Last Name">
            <Input
              placeholder="Enter your last name"
              disabled={true}
              value={initialValues.lastName}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            rules={[
              { required: true, message: 'Please input your phone number!' },
              () => ({
                validator(_, value) {
                  if (!value || Number(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The phone number must have a number!'),
                  );
                },
              }),
              () => ({
                validator(_, value) {
                  if (!value || value.length === 10) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Phone number must have 10 digits!'),
                  );
                },
              }),
            ]}
          >
            <Input
              placeholder="Enter your phone number"
              disabled={loading}
              showCount
              maxLength={10}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Email"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input
              placeholder="Enter your email"
              disabled={true}
              value={initialValues.email}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Gender">
            <Select disabled={true} value={initialValues.gender}>
              <Select.Option value={true}>Male</Select.Option>
              <Select.Option value={false}>Female</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dateBirth"
            label="Date of birth"
            rules={[
              { required: true, message: 'Please select your date of birth!' },
            ]}
          >
            <DatePicker
              disabled={loading}
              placeholder="Enter your date of birth"
              format={dateFormat}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="address"
            label="Address"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter your address"
              disabled={loading}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item wrapperCol={wrapperCol}>
            <Space style={{ float: 'right' }}>
              <Button
                htmlType="button"
                onClick={handleCancel}
                loading={loading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!submittable}
              >
                Save
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default EditProfileForm;
