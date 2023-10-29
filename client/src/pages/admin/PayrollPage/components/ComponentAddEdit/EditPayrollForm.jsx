import PropTypes from 'prop-types';
import {
  Form,
  Button,
  Space,
  Descriptions,
  Typography,
  DatePicker,
  InputNumber,
  Radio,
} from 'antd';
import { getFullDate } from 'utils/handleDate';
import { getMonthName } from 'utils/handleDate';
import { numberWithDot } from 'utils/format';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import dayjs from 'dayjs';

EditPayrollForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  infoPayroll: PropTypes.object,
};

EditPayrollForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  infoPayroll: {
    payrollId: '',
    payDate: '',
    deduction: 0,
    status: '',
  },
};

const createItems = (data) => [
  {
    key: '1',
    label: 'Payroll Id',
    children: data.id,
  },
  {
    key: '2',
    label: 'Month',
    children: getMonthName(data.month),
  },
  {
    key: '3',
    label: 'Employee Name',
    children: data.employeeData.firstName
      ? `${data.employeeData.firstName} ${data.employeeData.lastName}`
      : '',
    span: 2,
  },
  {
    key: '5',
    label: 'Start Date',
    children: getFullDate(data.startDate),
  },
  {
    key: '6',
    label: 'End Date',
    children: getFullDate(data.endDate),
  },
  {
    key: '11',
    label: 'Hours Worked',
    children: `${data.hoursWorked} hrs`,
  },
  {
    key: '11',
    label: 'Hours Overtime',
    children: `${data.hoursOvertime} hrs`,
  },
  {
    key: '4',
    label: 'Basic Hourly Salary',
    children: `${numberWithDot(data.salaryData.basicHourlySalary)}${
      data.currencyData.symbol
    }/hr`,
    span: 2,
  },
  {
    key: '4',
    label: 'Hourly Overtime Salary',
    children: `${numberWithDot(data.salaryData.hourlyOvertimeSalary)}${
      data.currencyData.symbol
    }/hr`,
    span: 2,
  },
  {
    key: '4',
    label: 'Allowance',
    children: `+ ${numberWithDot(data.salaryData.allowance)}${
      data.currencyData.symbol
    }`,
    span: 2,
  },
  {
    key: '4',
    label: 'Deduction',
    children: `- ${numberWithDot(data.deduction)}${data.currencyData.symbol}`,
    span: 2,
  },
  {
    key: '4',
    label: 'Total Paid',
    children: `${numberWithDot(data.totalPaid)}${data.currencyData.symbol}`,
    span: 2,
  },
  {
    key: '5',
    label: 'Pay Date',
    children: data.payDate ? getFullDate(data.payDate) : '',
  },
  {
    key: '10',
    label: 'Status',
    children: (
      <span
        style={{
          color: data.status === 'Paid' ? 'green' : '',
        }}
      >
        {data.status}
      </span>
    ),
  },
  {
    key: '13',
    label: 'Admin Name',
    children: data.handlerData.firstName
      ? `${data.handlerData.firstName} ${data.handlerData.lastName}`
      : '',
    span: 2,
  },
];

const wrapperCol = { offset: 8, span: 16 };

function EditPayrollForm(props) {
  const { onCancel, onSubmit, loading, infoPayroll } = props;
  const [submittable, setSubmittable] = useState(false);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const items = createItems(infoPayroll);

  const initialValues = {
    payDate: dayjs(infoPayroll.payDate),
    deduction: infoPayroll.deduction,
    status: infoPayroll.status,
  };

  useEffect(() => {
    const defaultValues = {
      payDate: dayjs(infoPayroll.payDate),
      deduction: infoPayroll.deduction,
      status: infoPayroll.status,
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
  }, [values, form, infoPayroll]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <Descriptions
        layout="horizontal"
        bordered
        title={<Typography.Title level={4}>Info Payroll</Typography.Title>}
        column={2}
        items={items}
      />
      {infoPayroll.status === 'Pending' ? (
        <>
          <Typography.Title level={4}>Edit Payroll</Typography.Title>
          <Form
            name="normal_edit_payroll"
            className="edit-payroll-form"
            initialValues={initialValues}
            onFinish={onFinish}
            form={form}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            style={{
              marginTop: 20,
              maxWidth: 600,
            }}
            size="large"
          >
            <Form.Item
              name="payDate"
              label="Pay Date"
              rules={[{ required: true, message: 'Please select pay date!' }]}
            >
              <DatePicker
                disabled={loading}
                style={{ width: '100%' }}
                format={'DD/MM/YYYY'}
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
                  `${value} ${infoPayroll?.currencyData.symbol}`.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ',',
                  )
                }
              />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Radio.Group>
                <Radio value="Pending"> Pending </Radio>
                <Radio value="Paid"> Paid</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item wrapperCol={wrapperCol}>
              <Space style={{ float: 'right' }}>
                <Button
                  htmlType="button"
                  onClick={handleCancel}
                  loading={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={!submittable}
                >
                  Save
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      ) : null}
    </div>
  );
}

export default EditPayrollForm;
