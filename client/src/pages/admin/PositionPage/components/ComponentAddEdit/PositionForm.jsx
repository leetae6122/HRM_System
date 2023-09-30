import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Space, InputNumber, Select } from "antd";
import currencyApi from "api/currencyApi";
import { toast } from "react-toastify";
import _ from "lodash";

PositionForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

PositionForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    name: "",
    minSalary: 0,
    MaxSalary: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function PositionForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [currencyOptions, setCurrencyOptions] = useState([]);
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

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await currencyApi.getAll();
        const options = response.data.map((currency) => ({
          value: currency.id,
          label: `${currency.name} - ${currency.code}${
            currency.symbol ? ` - ${currency.symbol}` : ""
          }`,
        }));
        setCurrencyOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

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
      name="normal_position"
      className="position-form"
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
      {initialValues.positionId ? (
        <Form.Item name="positionId" label="Position Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      <Form.Item
        name="name"
        label="Name"
        hasFeedback
        rules={[
          { required: true, message: "Please input the name of the position!" },
        ]}
      >
        <Input
          placeholder="Enter position name"
          disabled={loading}
          showCount
          maxLength={60}
        />
      </Form.Item>
      <Form.Item
        name="currencyId"
        label="Currency"
        hasFeedback
        rules={[{ required: true, message: "Please select currency!" }]}
      >
        <Select
          showSearch
          style={{
            width: "100%",
          }}
          placeholder="Search to Select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={currencyOptions}
        />
      </Form.Item>
      <Form.Item
        name="minSalary"
        label="Min Salary"
        hasFeedback
        rules={[
          { required: true, message: "Please input minimum salary!" },
          () => ({
            validator(_, value) {
              if (
                !value ||
                !form.getFieldValue("maxSalary") ||
                value < form.getFieldValue("maxSalary")
              ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Min Salary must be less than Max Salary!")
              );
            },
          }),
        ]}
      >
        <InputNumber
          style={{
            width: "100%",
          }}
          min={0}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="maxSalary"
        label="Max Salary"
        hasFeedbac
        rules={[
          () => ({
            validator(_, value) {
              if (!value || value > form.getFieldValue("minSalary")) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Max Salary must be greater than Min Salary!")
              );
            },
          }),
        ]}
      >
        <InputNumber
          style={{
            width: "100%",
          }}
          min={0}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: "right" }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            {initialValues.positionId ? "Save" : "Add"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default PositionForm;
