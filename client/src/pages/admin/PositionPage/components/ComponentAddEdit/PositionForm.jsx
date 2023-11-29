import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, InputNumber, Select } from 'antd';
import _ from 'lodash';
import { toast } from 'react-toastify';
import departmentApi from 'api/departmentApi';

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
    name: '',
    minHourlyWage: 0,
    maxHourlyWage: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function PositionForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
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

  useEffect(() => {
    const controller = new AbortController();
    const fetchDepartmentOptions = async () => {
      try {
        const response = await departmentApi.getAll();
        const options = response.data.map((department) => ({
          value: department.id,
          label: department.name,
        }));
        setDepartmentOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchDepartmentOptions();
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
          <Input
            disabled={true}
            style={{
              color: 'black',
            }}
          />
        </Form.Item>
      ) : null}
      <Form.Item
        name="name"
        label="Name"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the name of the position!' },
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
        name="minHourlyWage"
        label="Min Hourly Wage"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        hasFeedback
        rules={[
          { required: true, message: 'Please input minimum hourly salary!' },
          () => ({
            validator(_, value) {
              if (
                !value ||
                !form.getFieldValue('maxHourlyWage') ||
                value < form.getFieldValue('maxHourlyWage')
              ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('Min Salary must be less than Max Salary!'),
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
          formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          addonAfter={'VNĐ/hr'}
        />
      </Form.Item>
      <Form.Item
        name="maxHourlyWage"
        label="Max Hourly Wage"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        hasFeedback
        rules={[
          () => ({
            validator(_, value) {
              if (!value || value > form.getFieldValue('minHourlyWage')) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  'Max Hourly Wage must be greater than Min Hourly Wage!',
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
          formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          addonAfter={'VNĐ/hr'}
        />
      </Form.Item>
      <Form.Item
        name="departmentId"
        label="Department"
        hasFeedback
        rules={[{ required: true, message: 'Please select a department!' }]}
      >
        <Select
          showSearch
          style={{
            width: '100%',
          }}
          placeholder="Search to Select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={departmentOptions}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button htmlType="button" onClick={handleCancel} loading={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!submittable}
          >
            {initialValues.positionId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default PositionForm;
