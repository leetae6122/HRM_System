import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, InputNumber, DatePicker } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';

FilterPositionForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

FilterPositionForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    minHourlyWage: {
      from: null,
      to: null,
    },
    maxHourlyWage: {
      from: null,
      to: null,
    },
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

function FilterPositionForm(props) {
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
      <Form.Item
        label="Min Hourly Wage"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name={['minHourlyWage', 'from']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  !form.getFieldValue(['minHourlyWage', 'to']) ||
                  value < form.getFieldValue(['minHourlyWage', 'to'])
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Wage From must be less than Wage To!'),
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
            placeholder="From (number)"
            formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter={'VNĐ/hr'}
          />
        </Form.Item>

        <Form.Item
          name={['minHourlyWage', 'to']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  value > form.getFieldValue(['minHourlyWage', 'from'])
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Wage To must be less than Wage From!'),
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
            placeholder="To (number)"
            formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter={'VNĐ/hr'}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item
        label="Max Hourly Wage"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name={['maxHourlyWage', 'from']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  !form.getFieldValue(['maxHourlyWage', 'to']) ||
                  value < form.getFieldValue(['maxHourlyWage', 'to'])
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Wage From must be less than Wage To!'),
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
            placeholder="From (number)"
            formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter={'VNĐ/hr'}
          />
        </Form.Item>

        <Form.Item
          name={['maxHourlyWage', 'to']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  value > form.getFieldValue(['maxHourlyWage', 'from'])
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Wage To must be less than Wage From!'),
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
            placeholder="To (number)"
            formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter={'VNĐ/hr'}
          />
        </Form.Item>
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

export default FilterPositionForm;
