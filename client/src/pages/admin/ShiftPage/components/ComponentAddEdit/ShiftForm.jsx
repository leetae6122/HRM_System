import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, DatePicker, Radio } from 'antd';
import _ from 'lodash';

ShiftForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

ShiftForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    name: '',
    startTime: null,
    endTime: null,
    overtimeShift: false,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function ShiftForm(props) {
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

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_task"
      className="task-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      style={{
        maxWidth: 600,
      }}
      size="large"
    >
      {initialValues.shiftId ? (
        <Form.Item name="shiftId" label="Shift Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      <Form.Item
        name="name"
        label="Name"
        hasFeedback
        rules={[{ required: true, message: 'Please enter shift name!' }]}
      >
        <Input
          placeholder="Enter the shift name"
          disabled={loading}
          showCount
          maxLength={60}
        />
      </Form.Item>
      <Form.Item
        name="startTime"
        label="Start Time"
        rules={[{ required: true, message: 'Please select start time!' }]}
      >
        <DatePicker
          picker={'time'}
          disabled={loading}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        name="endTime"
        label="End Time"
        rules={[{ required: true, message: 'Please select end time!' }]}
      >
        <DatePicker
          picker={'time'}
          disabled={loading}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item label="Shift Type" name="overtimeShift">
          <Radio.Group>
            <Radio value={false}> Main shift </Radio>
            <Radio value={true}> Overtime shift</Radio>
          </Radio.Group>
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
            {initialValues.shiftId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default ShiftForm;
