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
    amount: 0,
    startDate: '',
    endDate: '',
    employeeId: null,
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

function AllowanceForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const getSelectedEmployee = async (id) => {
    const data = (await employeeApi.getById(id)).data;
    setSelectedEmployee(data);
  };
  useEffect(() => {
    const defaultValues = {
      allowanceId: initialValues.allowanceId,
      title: initialValues.title,
      amount: initialValues.amount,
      startDate: initialValues.startDate,
      endDate: initialValues.endDate,
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
          label: `${employee.firstName} ${employee.lastName}`,
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
                ? `${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`
                : ''
            }
            style={{
              color: 'black',
            }}
          />
        </Form.Item>
      ) : (
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
            onChange={getSelectedEmployee}
          />
        </Form.Item>
      )}
      {selectedEmployee ? (
        <>
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
            />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            hasFeedback
            rules={[{ required: true, message: 'Please select a start date!' }]}
          >
            <DatePicker
              disabled={loading}
              style={{ width: '100%' }}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item name="endDate" label="End Date" hasFeedback>
            <DatePicker
              disabled={loading}
              style={{ width: '100%' }}
              format={dateFormat}
            />
          </Form.Item>
        </>
      ) : null}
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
