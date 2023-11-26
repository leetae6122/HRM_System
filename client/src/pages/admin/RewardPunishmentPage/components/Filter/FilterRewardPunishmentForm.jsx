import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, InputNumber, DatePicker } from 'antd';
import _ from 'lodash';

FilterRewardPunishmentForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

FilterRewardPunishmentForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    amount: {
      from: null,
      to: null,
    },
    date: '',
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function FilterRewardPunishmentForm(props) {
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
      name="normal_filter_reward_punishment"
      className="filter-reward-punishment-form"
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
      <Form.Item label="Amount">
        <Form.Item
          name={['amount', 'from']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (
                  !value ||
                  !form.getFieldValue(['amount', 'to']) ||
                  value < form.getFieldValue(['amount', 'to'])
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Amount From must be less than Amount To!'),
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
            addonAfter={'VNĐ'}
          />
        </Form.Item>

        <Form.Item
          name={['amount', 'to']}
          hasFeedback
          rules={[
            () => ({
              validator(_, value) {
                if (!value || form.getFieldValue(['amount', 'from'])) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Please enter Amount From first!'),
                );
              },
            }),
            () => ({
              validator(_, value) {
                if (!value || value > form.getFieldValue(['amount', 'from'])) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Amount To must be greater than Amount From!'),
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
            addonAfter={'VNĐ'}
          />
        </Form.Item>
      </Form.Item>
      <Form.Item name="date" label="Effective Date">
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

export default FilterRewardPunishmentForm;
