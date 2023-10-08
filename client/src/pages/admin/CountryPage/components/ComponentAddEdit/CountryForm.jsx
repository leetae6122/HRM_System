import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, InputNumber } from 'antd';
import _ from 'lodash';

CountryForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

CountryForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    name: '',
    countryCode: null,
    isoCode: '',
  },
};

const wrapperCol = { offset: 8, span: 16 };

function CountryForm(props) {
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
      name="normal_country"
      className="country-form"
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
      {initialValues.countryId ? (
        <Form.Item name="countryId" label="Country Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      <Form.Item
        name="name"
        label="Name"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the name of the country!' },
        ]}
      >
        <Input
          placeholder="Enter the country name"
          disabled={loading}
          showCount
          maxLength={30}
        />
      </Form.Item>
      <Form.Item
        name="countryCode"
        label="Country Code"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the code of the country!' },
        ]}
      >
        <InputNumber
          style={{
            width: '100%',
          }}
          placeholder="Enter the country code"
          disabled={loading}
          maxLength={3}
          min={1}
        />
      </Form.Item>
      <Form.Item
        name="isoCode"
        label="IsoCode"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please input the IsoCode of the country!',
          },
        ]}
      >
        <Input
          placeholder="Enter the country IsoCode"
          disabled={loading}
          showCount
          maxLength={10}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            {initialValues.countryId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default CountryForm;
