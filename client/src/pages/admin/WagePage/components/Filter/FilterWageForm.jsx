import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, InputNumber, DatePicker } from 'antd';
import _ from 'lodash';

FilterWageForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

FilterWageForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    basicHourlyWage: {
      from: null,
      to: null,
    },
    fromDate: '',
    toDate: '',
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function FilterWageForm(props) {
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
      name="normal_filter_wage"
      className="filter_wage-form"
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
      <Form.Item label="Min Hourly Wage">
        <Form.Item
          name={['basicHourlyWage', 'from']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  !form.getFieldValue('basicHourlyWage').to ||
                  value < form.getFieldValue('basicHourlyWage').to
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    'Basic Hourly Wage From must be less than Basic Hourly Wage To!',
                  ),
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
          />
        </Form.Item>

        <Form.Item
          name={['basicHourlyWage', 'to']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  value > form.getFieldValue('basicHourlyWage').from
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    'Basic Hourly Wage To must be less than Basic Hourly Wage From!',
                  ),
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
          />
        </Form.Item>
      </Form.Item>
      <Form.Item
        name="fromDate"
        label="From Date"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <DatePicker
          disabled={loading}
          format={dateFormat}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item
        name="toDate"
        label="To Date"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <DatePicker
          disabled={loading}
          format={dateFormat}
          style={{
            width: '100%',
          }}
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

export default FilterWageForm;
