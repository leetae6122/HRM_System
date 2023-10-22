import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, InputNumber, DatePicker } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';

FilterPositionForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

FilterPositionForm.defaultProps = {
  onSubmit: null,
  loading: false,
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

const initialValues = {
  minSalary: {
    from: null,
    to: null,
  },
  maxSalary: {
    from: null,
    to: null,
  },
  createdAt: [],
};

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

function FilterPositionForm(props) {
  const { onSubmit, loading } = props;
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
  }, [values, form]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="normal_filter_position"
      className="filter_position-form"
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
      <Form.Item label="Min Salary">
        <Form.Item
          name={['minSalary', 'from']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  !form.getFieldValue('minSalary').to ||
                  value < form.getFieldValue('minSalary').to
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Salary From must be less than Salary To!'),
                );
              },
            }),
          ]}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
            controls={false}
            min={0}
            disabled={loading}
            placeholder="Salary From (number)"
          />
        </Form.Item>

        <Form.Item
          name={['minSalary', 'to']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (!value || value > form.getFieldValue('minSalary').from) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Salary To must be less than Salary From!'),
                );
              },
            }),
          ]}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
            controls={false}
            min={0}
            disabled={loading}
            placeholder="Salary To (number)"
          />
        </Form.Item>
      </Form.Item>

      <Form.Item label="Max Salary">
        <Form.Item
          name={['maxSalary', 'from']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  !form.getFieldValue('maxSalary').to ||
                  value < form.getFieldValue('maxSalary').to
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Salary From must be less than Salary To!'),
                );
              },
            }),
          ]}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
            controls={false}
            min={0}
            disabled={loading}
            placeholder="Salary From (number)"
          />
        </Form.Item>

        <Form.Item
          name={['maxSalary', 'to']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (!value || value > form.getFieldValue('maxSalary').from) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Salary To must be less than Salary From!'),
                );
              },
            }),
          ]}
        >
          <InputNumber
            style={{
              width: '100%',
            }}
            controls={false}
            min={0}
            disabled={loading}
            placeholder="Salary To (number)"
          />
        </Form.Item>
      </Form.Item>

      <Form.Item name="createdAt" label="Date created">
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

export default FilterPositionForm;
