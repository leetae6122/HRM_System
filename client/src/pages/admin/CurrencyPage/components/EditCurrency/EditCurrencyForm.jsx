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

const wrapperCol = { offset: 8, span: 16 };

function EditCurrencyForm(props) {
  const { onCancel, onSubmit, loading, editCurrency } = props;
  const [currencyCodeList, setCurrencyCodeList] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        if (!_.isEqual(editCurrency, values)) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
      },
      () => setSubmittable(false)
    );
  }, [values, form, editCurrency]);

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
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item name="currencyId" label="Currency Id">
        <Input size="large" disabled={true} />
      </Form.Item>
      <Form.Item name="name" label="Name">
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
      >
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
            Save
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default EditCurrencyForm;
