import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, DatePicker, Select } from 'antd';
import _ from 'lodash';
import employeeApi from 'api/employeeApi';
import { toast } from 'react-toastify';

AddLeaveForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

AddLeaveForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    title: '',
    description: '',
    rangeDateLeave: [],
    employeeId: null,
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function AddLeaveForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
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
    const fetchData = async () => {
      try {
        const data = (await employeeApi.getAll()).data;
        const options = data.map((employee) => ({
          value: employee.id,
          label: `#${employee.id} - ${employee.lastName} ${employee.firstName}`,
        }));
        setEmployeeOptions(options);
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

  const disabledDate = (current) => {
    return current && current.valueOf() < Date.now();
  };

  return (
    <Form
      name="normal_add_leave"
      className="add-leave-form"
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
      <Form.Item
        name="employeeId"
        label="Employee"
        hasFeedback
        rules={[{ required: true, message: 'Please select an employee!' }]}
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
          options={employeeOptions}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="title"
        label="Title"
        hasFeedback
        rules={[
          { required: true, message: 'Please input the title of the leave!' },
        ]}
      >
        <Input
          placeholder="Enter the leave title"
          disabled={loading}
          showCount
          maxLength={40}
        />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        rules={[{ required: true, message: 'Please input description!' }]}
      >
        <Input.TextArea
          rows={3}
          placeholder="Enter description"
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="rangeDateLeave"
        label="Date Leave"
        rules={[{ required: true, message: 'Please select date leave!' }]}
      >
        <DatePicker.RangePicker
          disabled={loading}
          format={dateFormat}
          disabledDate={disabledDate}
          style={{
            width: '100%',
          }}
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
            Add
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default AddLeaveForm;
