import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, DatePicker } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';

LeaveForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

LeaveForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    title: '',
    description: '',
    rangeDateLeave: [],
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function LeaveForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        if (!_.isEqual(initialValues, values)) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
      },
      () => setSubmittable(false),
    );
  }, [values, form, initialValues]);

  const disabledDate = (date) => {
    if (date > dayjs()) {
      return false;
    }
    return true;
  };

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_leave"
      className="leave-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      style={{
        maxWidth: 600,
      }}
      size="large"
    >
      {initialValues.leaveId ? (
        <Form.Item name="leaveId" label="Leave Id">
          <Input
            disabled={true}
            style={{
              color: 'black',
            }}
          />
        </Form.Item>
      ) : null}
      <Form.Item
        name="title"
        label="Title"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the title of the leave!' },
        ]}
      >
        <Input
          placeholder="Enter the leave title"
          disabled={loading}
          showCount
          maxLength={40}
        />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        rules={[{ required: true, message: 'Please input description!' }]}
      >
        <Input.TextArea
          placeholder="Enter description"
          disabled={loading}
          style={{ height: 200, resize: 'none' }}
        />
      </Form.Item>
      <Form.Item
        name="rangeDateLeave"
        label="Date Leave"
        rules={[{ required: true, message: 'Please select date leave!' }]}
      >
        <DatePicker.RangePicker
          disabled={loading}
          format={dateFormat}
          disabledDate={disabledDate}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button htmlType="button" onClick={handleCancel} loading={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!submittable}
          >
            {initialValues.leaveId ? 'Save' : 'Create'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default LeaveForm;
