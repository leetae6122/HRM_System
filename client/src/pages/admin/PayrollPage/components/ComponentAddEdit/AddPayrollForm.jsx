import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, Select, InputNumber, DatePicker } from 'antd';
import _ from 'lodash';
import employeeApi from 'api/employeeApi';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { getMonthName } from 'utils/handleDate';

AddPayrollForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

AddPayrollForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    month: '',
    payrollDateRange: [],
    deduction: null,
    employeeId: '',
  },
};

const wrapperCol = { offset: 8, span: 16 };

const dateFormat = 'DD/MM/YYYY';

const rangePresets = [
  {
    label: 'Last 7 Days',
    value: [dayjs().add(-7, 'd'), dayjs()],
  },
  {
    label: 'Last 14 Days',
    value: [dayjs().add(-14, 'd'), dayjs()],
  },
  {
    label: 'Last 30 Days',
    value: [dayjs().add(-30, 'd'), dayjs()],
  },
  {
    label: 'Last 90 Days',
    value: [dayjs().add(-90, 'd'), dayjs()],
  },
];

function AddPayrollForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState();

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
          label: `${employee.firstName} ${employee.lastName}`,
        }));
        setEmployeeOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const onEmployeeChange = async (value) => {
    const data = (await employeeApi.getById(value)).data;
    setSelectedEmployee(data);
  };

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_add_payroll"
      className="add-payroll-form"
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
      <Form.Item
        name="employeeId"
        label="Employee"
        hasFeedback
        rules={[{ required: true, message: 'Please select employee!' }]}
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
          onChange={onEmployeeChange}
          disabled={loading}
        />
      </Form.Item>
      {selectedEmployee ? (
        <>
          <Form.Item
            name="month"
            label="Month Payroll"
            rules={[{ required: true, message: 'Please select month payroll!' }]}
          >
            <DatePicker
              picker={'month'}
              disabled={loading}
              style={{ width: '100%' }}
              format={(value) =>  getMonthName(value)}
            />
          </Form.Item>
          <Form.Item
            name="payrollDateRange"
            label="Payroll date range"
            hasFeedback
            rules={[
              { required: true, message: 'Please select Payroll date range!' },
            ]}
          >
            <DatePicker.RangePicker
              disabled={loading}
              format={dateFormat}
              style={{
                width: '100%',
              }}
              presets={rangePresets}
            />
          </Form.Item>
          <Form.Item name="deduction" label="Deduction" hasFeedback>
            <InputNumber
              style={{
                width: '100%',
              }}
              controls={false}
              min={0}
              disabled={loading}
              formatter={(value) =>
                selectedEmployee
                  ? `${value} ${selectedEmployee?.salaryData.currencyData.symbol}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    )
                  : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
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
            {initialValues.payrollId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default AddPayrollForm;
