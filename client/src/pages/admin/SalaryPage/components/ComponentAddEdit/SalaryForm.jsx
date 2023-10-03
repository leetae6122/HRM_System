import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, InputNumber, Select } from 'antd';
import currencyApi from 'api/currencyApi';
import { toast } from 'react-toastify';
import _ from 'lodash';
import employeeApi from 'api/employeeApi';

SalaryForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

SalaryForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    basicSalary: 0,
    allowance: null,
    totalSalary: null,
    currencyId: null,
    employeeId: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function SalaryForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [form] = Form.useForm();

  const values = Form.useWatch([], form);

  const getSelectedEmployee = async (value) => {
    const data = (await employeeApi.getById(value)).data;
    setSelectedEmployee(data);
  };

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
    const fetchDataCurrencyOptions = async () => {
      try {
        const response = await currencyApi.getAll();
        const options = response.data.map((currency) => ({
          value: currency.id,
          label: `${currency.name} - ${currency.code}${
            currency.symbol ? ` - ${currency.symbol}` : ''
          }`,
        }));
        setCurrencyOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchDataEmployeeOptions = async () => {
      try {
        const data = (await employeeApi.getEmployeeNotHaveSalary()).data;
        const options = data.map((employee) => ({
          value: employee.id,
          label: `${employee.firstName} ${employee.lastName}`,
        }));
        setEmployeeOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchDataCurrencyOptions();
    fetchDataEmployeeOptions();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      if (initialValues.employeeId) {
        getSelectedEmployee(initialValues.employeeId);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [initialValues.employeeId]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_salary"
      className="salary-form"
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
      {initialValues.salaryId ? (
        <Form.Item name="salaryId" label="Salary Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      {initialValues.salaryId ? (
        <Form.Item label="Employee">
          <Input
            disabled={true}
            value={`${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`}
          />
        </Form.Item>
      ) : (
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
            disabled={loading}
            onChange={getSelectedEmployee}
          />
        </Form.Item>
      )}

      <Form.Item
        name="basicSalary"
        label="Basic Salary"
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please input the employee's basic salary!",
          },
          () => ({
            validator(_, value) {
              if (!value || (value && form.getFieldValue('employeeId'))) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  'Please select an employee before entering your base salary!',
                ),
              );
            },
          }),
          () => ({
            validator(_, value) {
              if (
                !value ||
                (value >= selectedEmployee?.positionData.minSalary &&
                  value <= selectedEmployee?.positionData.maxSalary)
              ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  `The base salary must be greater than equal to ${selectedEmployee?.positionData.minSalary} and less than equal to ${selectedEmployee?.positionData.maxSalary}`,
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
          min={0}
          disabled={loading}
          addonBefore={
            selectedEmployee ? selectedEmployee?.positionData.minSalary : ''
          }
          addonAfter={
            selectedEmployee ? selectedEmployee?.positionData.maxSalary : ''
          }
        />
      </Form.Item>
      <Form.Item name="allowance" label="Allowance" hasFeedback>
        <InputNumber
          style={{
            width: '100%',
          }}
          min={0}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="totalSalary"
        label="Total Salary"
        hasFeedback
        rules={[
          () => ({
            validator(_, value) {
              if (
                !value ||
                value >=
                  form.getFieldValue('basicSalary') +
                    form.getFieldValue('allowance')
              ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  'The Total Salary must be greater than the sum of the basic salary and allowances!',
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
          min={0}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item
        name="currencyId"
        label="Currency"
        hasFeedback
        rules={[{ required: true, message: 'Please select currency!' }]}
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
          options={currencyOptions}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            {initialValues.salaryId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default SalaryForm;
