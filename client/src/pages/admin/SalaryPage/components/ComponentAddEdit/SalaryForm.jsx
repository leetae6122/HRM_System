import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Space,
  InputNumber,
  Select,
  Row,
  Col,
} from 'antd';
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
    allowance: 0,
    totalSalary: 0,
    currencyId: null,
    employeeId: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function SalaryForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [submittable, setSubmittable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const getSelectedEmployee = async (id) => {
    const data = (await employeeApi.getById(id)).data;
    form.setFieldValue('currencyId', data.positionData.currencyData.id);
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
    fetchDataEmployeeOptions();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      if (initialValues.salaryId) {
        const data = (await employeeApi.getById(initialValues.employeeId)).data;
        setSelectedEmployee(data);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [initialValues.salaryId, initialValues.employeeId]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  const onChangeBasicSalary = (value) => {
    form.setFieldValue('totalSalary', value + values.allowance);
  };

  const onChangeAllowance = (value) => {
    form.setFieldValue('totalSalary', value + values.basicSalary);
  };

  return (
    <Form
      name="normal_salary"
      className="salary-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
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
            value={
              selectedEmployee
                ? `${selectedEmployee?.firstName} ${selectedEmployee?.lastName}`
                : ''
            }
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
      {selectedEmployee ? (
        <>
          <Row>
            <Col span={10}>
              <Form.Item
                name="currencyId"
                label="Currency Id"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item
                label="Currency"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  disabled={true}
                  value={
                    selectedEmployee
                      ? `${selectedEmployee?.positionData.currencyData.name} - ${selectedEmployee?.positionData.currencyData.code} - ${selectedEmployee?.positionData.currencyData.symbol}`
                      : ''
                  }
                />
              </Form.Item>
            </Col>
          </Row>
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
              controls={false}
              min={0}
              disabled={loading}
              addonBefore={
                selectedEmployee
                  ? `${selectedEmployee?.positionData.minSalary} ${selectedEmployee?.positionData.currencyData.symbol}`
                  : ''
              }
              addonAfter={
                selectedEmployee
                  ? `${selectedEmployee?.positionData.maxSalary} ${selectedEmployee?.positionData.currencyData.symbol}`
                  : ''
              }
              formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChange={onChangeBasicSalary}
            />
          </Form.Item>
          <Form.Item name="allowance" label="Allowance" hasFeedback>
            <InputNumber
              style={{
                width: '100%',
              }}
              controls={false}
              min={0}
              disabled={loading}
              formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChange={onChangeAllowance}
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
              controls={false}
              min={0}
              disabled={loading}
              formatter={(value) =>
                selectedEmployee
                  ? `${value} ${selectedEmployee?.positionData.currencyData.symbol}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    )
                  : ''
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
            {initialValues.salaryId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default SalaryForm;
