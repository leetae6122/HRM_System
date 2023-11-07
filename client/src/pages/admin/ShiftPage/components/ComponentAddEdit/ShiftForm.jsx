import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, DatePicker, Radio, Checkbox, InputNumber } from 'antd';
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
    wageRate: 0,
    days: [],
  },
};

const optionsDays = [
  {
    label: 'Monday',
    value: 1,
  },
  {
    label: 'Tuesday',
    value: 2,
  },
  {
    label: 'Wednesday',
    value: 3,
  },
  {
    label: 'Thursday',
    value: 4,
  },
  {
    label: 'Friday',
    value: 5,
  },
  {
    label: <span style={{ color: 'red' }}>Saturday</span>,
    value: 6,
  },
  {
    label: <span style={{ color: 'red' }}>Sunday</span>,
    value: 0,
  },
];

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
          <Input
            disabled={true}
            style={{
              color: 'black',
            }}
          />
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
        hasFeedback
        rules={[{ required: true, message: 'Please select a start time!' }]}
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
        hasFeedback
        rules={[{ required: true, message: 'Please select a end time!' }]}
      >
        <DatePicker
          picker={'time'}
          disabled={loading}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        name="wageRate"
        label="Wage Rate"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please input wage rate!",
          },
        ]}
      >
        <InputNumber
          style={{
            width: '100%',
          }}
          controls={false}
          min={0}
          disabled={loading}
          formatter={(value) => `${value} %`}
        />
      </Form.Item>
      <Form.Item
        name="days"
        label="Days"
        hasFeedback
        rules={[{ required: true, message: 'Please select days!' }]}
      >
        <Checkbox.Group options={optionsDays} />
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
