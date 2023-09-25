import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Space } from "antd";
import currencyApi from "api/currencyApi";
import { toast } from "react-toastify";
import _ from "lodash";

EditCurrencyForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  editCurrency: PropTypes.object,
};

EditCurrencyForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  editCurrency: {},
};

function EditCurrencyForm(props) {
  const { onCancel, onSubmit, loading, editCurrency } = props;
  const [currencyCodeList, setCurrencyCodeList] = useState([]);
  const [isDataChange, setIsDataChange] = useState(false);
  const [form] = Form.useForm();

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

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_edit_currency"
      className="edit_currency-form"
      initialValues={editCurrency}
      onFinish={onFinish}
      form={form}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[
          () => {
            if (_.isEqual(editCurrency, form.getFieldValue())) {
              setIsDataChange(true);
            } else {
              setIsDataChange(false);
            }
          },
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
        rules={[
          () => ({
            validator(_, value) {
              if (
                !value ||
                !currencyCodeList.includes(value) ||
                value === editCurrency.code
              ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Currency code has been created!")
              );
            },
          }),
          () => {
            if (_.isEqual(editCurrency, form.getFieldValue())) {
              setIsDataChange(true);
            } else {
              setIsDataChange(false);
            }
          },
        ]}
      >
        <Input
          size="large"
          placeholder="Enter the currency code"
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="symbol"
        label="Symbol"
        rules={[
          () => {
            if (_.isEqual(editCurrency, form.getFieldValue())) {
              setIsDataChange(true);
            } else {
              setIsDataChange(false);
            }
          },
        ]}
      >
        <Input
          size="large"
          placeholder="Enter the currency symbol"
          disabled={loading}
        />
      </Form.Item>
      <Form.Item>
        <Space style={{ float: "right" }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={isDataChange}>
            Submit
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default EditCurrencyForm;
