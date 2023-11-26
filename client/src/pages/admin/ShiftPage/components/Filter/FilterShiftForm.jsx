import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, DatePicker, TimePicker } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';

FilterShiftForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

FilterShiftForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    rangeTime: [],
    createdAt: [],
    updatedAt: [],
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

const rangePresets = [
  {
    label: 'Last 7 Days',
    value: [dayjs().add(-7, 'd'), dayjs()],
  },
  {
    label: 'Last 14 Days',
    value: [dayjs().add(-14, 'd'), dayjs()],
  },
  {
    label: 'Last 30 Days',
    value: [dayjs().add(-30, 'd'), dayjs()],
  },
  {
    label: 'Last 90 Days',
    value: [dayjs().add(-90, 'd'), dayjs()],
  },
];

function FilterShiftForm(props) {
  const { onSubmit, loading, initialValues } = props;
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

  const onChange = (value) => {
    form.setFieldValue('rangeTime',[value[0].second(0), value[1].second(0)])
  };

  return (
    <Form
      name="normal_filter_shift"
      className="filter-shift-form"
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
      <Form.Item
        name="rangeTime"
        label="Range Time"
        hasFeedback
        rules={[{ required: true, message: 'Please select range time!' }]}
      >
        <TimePicker.RangePicker
          format="HH:mm A"
          disabled={loading}
          style={{ width: '100%' }}
          onChange={onChange}
        />
      </Form.Item>
      <Form.Item name="createdAt" label="Date Created">
        <DatePicker.RangePicker
          disabled={loading}
          format={dateFormat}
          style={{
            width: '100%',
          }}
          presets={rangePresets}
        />
      </Form.Item>
      <Form.Item name="updatedAt" label="Date Updated">
        <DatePicker.RangePicker
          disabled={loading}
          format={dateFormat}
          style={{
            width: '100%',
          }}
          presets={rangePresets}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            Filter
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default FilterShiftForm;
