import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Space,
  InputNumber,
  Select,
  DatePicker,
} from 'antd';
import { toast } from 'react-toastify';
import _ from 'lodash';
import employeeApi from 'api/employeeApi';
import { getMonthName } from 'utils/handleDate';

AllowanceForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

AllowanceForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    title: '',
    amount: null,
    timeApplication: [],
    employeeId: null,
    employees: [],
  },
};

const wrapperCol = { offset: 8, span: 16 };

function AllowanceForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    const defaultValues = {
      allowanceId: initialValues.allowanceId,
      title: initialValues.title,
      timeApplication: initialValues.timeApplication,
      amount: initialValues.amount,
    };
    form.validateFields({ validateOnly: true }).then(
      () => {
        if (!_.isEqual(defaultValues, values)) {
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
    const fetchDataEmployeeOptions = async () => {
      try {
        const data = (await employeeApi.getAll()).data;
        const options = data.map((employee) => ({
          value: employee.id,
          label: `${employee.lastName} ${employee.firstName}`,
          desc: `#${employee.id} - ${employee.lastName} ${employee.firstName}`,
        }));
        setEmployeeOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchDataEmployeeOptions();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      if (initialValues.allowanceId) {
        const data = (await employeeApi.getById(initialValues.employeeId)).data;
        setSelectedEmployee(data);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [initialValues.allowanceId, initialValues.employeeId]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_allowance"
      className="allowance-form"
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
      {initialValues.allowanceId ? (
        <Form.Item name="allowanceId" label="Allowance Id">
          <Input
            disabled={true}
            style={{
              color: 'black',
            }}
          />
        </Form.Item>
      ) : null}
      {initialValues.allowanceId ? (
        <Form.Item label="Employee">
          <Input
            disabled={true}
            value={
              selectedEmployee
                ? `#${selectedEmployee.id} - ${selectedEmployee.lastName} ${selectedEmployee.firstName}`
                : ''
            }
            style={{
              color: 'black',
            }}
          />
        </Form.Item>
      ) : (
        <Form.Item
          name="employees"
          label="Employees"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please select an employee!',
              type: 'array',
            },
          ]}
        >
          <Select
            mode="multiple"
            style={{
              width: '100%',
            }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.desc ?? '').includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.desc ?? '')
                .toLowerCase()
                .localeCompare((optionB?.desc ?? '').toLowerCase())
            }
            placeholder="Please select"
            options={employeeOptions}
            disabled={loading}
            optionRender={(option) => option.data.desc}
          />
        </Form.Item>
      )}

      <Form.Item
        name="title"
        label="Title"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please enter the title of the allowance!',
          },
        ]}
      >
        <Input
          placeholder="Enter the title of the allowance"
          disabled={loading}
          showCount
          maxLength={60}
        />
      </Form.Item>
      <Form.Item
        name="amount"
        label="Amount"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please enter the amount!',
          },
          () => ({
            validator(_, value) {
              if (!value || (value && Number(value) >= 50000)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('Amount must be greater than 50.000 VNĐ!'),
              );
            },
          }),
        ]}
      >
        <InputNumber
          style={{
            width: '100%',
          }}
          min={0}
          controls={false}
          disabled={loading}
          formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          addonAfter={'VNĐ'}
          placeholder="Enter the allowance amount"
        />
      </Form.Item>
      <Form.Item
        name="timeApplication"
        label="Time Application"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        rules={[{ required: true, message: 'Please select date!' }]}
      >
        <DatePicker.RangePicker
          disabled={loading}
          format={(value) => getMonthName(value)}
          style={{
            width: '100%',
          }}
          picker="month"
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
            {initialValues.allowanceId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default AllowanceForm;
