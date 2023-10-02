import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Space } from "antd";
import _ from "lodash";

CurrencyForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

CurrencyForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    name: "",
    code: "",
    symbol: "",
  },
};

const wrapperCol = { offset: 8, span: 16 };

function CurrencyForm(props) {
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
      () => setSubmittable(false)
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
      name="normal_currency"
      className="currency-form"
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
      {initialValues.currencyId ? (
        <Form.Item name="currencyId" label="Currency Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      <Form.Item
        name="name"
        label="Name"
        hasFeedback
        rules={[
          { required: true, message: "Please input the name of the currency!" },
        ]}
      >
        <Input
          placeholder="Enter the currency name"
          disabled={loading}
          showCount
          maxLength={40}
        />
      </Form.Item>
      <Form.Item
        name="code"
        label="Code"
        hasFeedback
        rules={[
          { required: true, message: "Please input the code of the currency!" },
        ]}
      >
        <Input
          placeholder="Enter the currency code"
          disabled={loading}
          showCount
          maxLength={20}
        />
      </Form.Item>
      <Form.Item name="symbol" label="Symbol" hasFeedback>
        <Input
          placeholder="Enter the currency symbol"
          disabled={loading}
          showCount
          maxLength={20}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: "right" }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            {initialValues.currencyId ? "Save" : "Add"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default CurrencyForm;
