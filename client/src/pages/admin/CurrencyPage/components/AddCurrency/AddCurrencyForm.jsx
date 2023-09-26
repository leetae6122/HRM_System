import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Space } from "antd";
import currencyApi from "api/currencyApi";
import { toast } from "react-toastify";

AddCurrencyForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

AddCurrencyForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
};

const wrapperCol = { offset: 8, span: 16 };

function AddCurrencyForm(props) {
  const { onCancel, onSubmit, loading } = props;
  const [currencyCodeList, setCurrencyCodeList] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => setSubmittable(true),
      () => setSubmittable(false)
    );
  }, [values, form]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await currencyApi.getAll();
        const list = response.data.map((currency) => currency.code);
        setCurrencyCodeList(list);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const initialValues = {
    name: "",
    code: "",
    symbol: "",
  };

  const onFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Form
      name="normal_add_currency"
      className="add_currency-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        name="name"
        label="Name"
        hasFeedback
        rules={[
          { required: true, message: "Please input the name of the currency!" },
        ]}
      >
        <Input
          size="large"
          placeholder="Enter the currency name"
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="code"
        label="Code"
        hasFeedback
        rules={[
          { required: true, message: "Please input the code of the currency!" },
          () => ({
            validator(_, value) {
              if (!value || !currencyCodeList.includes(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Currency code has been created!")
              );
            },
          }),
        ]}
      >
        <Input
          size="large"
          placeholder="Enter the currency code"
          disabled={loading}
        />
      </Form.Item>
      <Form.Item name="symbol" label="Symbol" hasFeedback>
        <Input
          size="large"
          placeholder="Enter the currency symbol"
          disabled={loading}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: "right" }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            Add
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default AddCurrencyForm;
