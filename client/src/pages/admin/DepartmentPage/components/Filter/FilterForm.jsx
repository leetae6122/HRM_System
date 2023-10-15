import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Space, InputNumber, Select } from "antd";
import currencyApi from "api/currencyApi";
import { toast } from "react-toastify";
import _ from "lodash";

FilterDrawerForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  editPosition: PropTypes.object,
};

FilterDrawerForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  editPosition: {},
};

const wrapperCol = { offset: 8, span: 16 };

function FilterDrawerForm(props) {
  const { onCancel, onSubmit, loading, editPosition } = props;
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        if (!_.isEqual(editPosition, values)) {
          setSubmittable(true);
        } else {
          setSubmittable(false);
        }
      },
      () => setSubmittable(false)
    );
  }, [values, form, editPosition]);

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
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_edit_position"
      className="edit_position-form"
      initialValues={editPosition}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      style={{
        maxWidth: 600,
      }}
      size="large"
    >
      <Form.Item name="positionId" label="Position Id">
        <Input disabled={true} />
      </Form.Item>
      <Form.Item name="name" label="Name" hasFeedback>
        <Input
          placeholder="Enter position name"
          disabled={loading}
          showCount
          maxLength={60}
        />
      </Form.Item>
      <Form.Item name="currencyId" label="Currency" hasFeedback>
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
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="minSalary"
        label="Min Salary"
        hasFeedback
        rules={[
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
          controls={false}
          min={0}
          formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="maxSalary"
        label="Max Salary"
        hasFeedback
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
          controls={false}
          disabled={loading}
          formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: "right" }}>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            Filter
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default FilterDrawerForm;
