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
    basicHourlySalary: 0,
    hourlyOvertimeSalary: 0,
    allowance: 0,
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
    const defaultValues = {
      basicHourlySalary: initialValues.basicHourlySalary,
      hourlyOvertimeSalary: initialValues.hourlyOvertimeSalary,
      allowance: initialValues.allowance,
      currencyId: initialValues.currencyId,
      salaryId: initialValues.salaryId
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
            <Col span={12}>
              <Form.Item
                name="currencyId"
                label="Currency Id"
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            name="basicHourlySalary"
            label="Basic Hourly Salary"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input the employee's basic hourly salary!",
              },
              () => ({
                validator(_, value) {
                  if (!value || (value && form.getFieldValue('employeeId'))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'Please select an employee before entering your basic hourly salary!',
                    ),
                  );
                },
              }),
              () => ({
                validator(_, value) {
                  if (
                    !value || selectedEmployee?.positionData.maxHourlySalary
                      ? value >=
                          selectedEmployee?.positionData.minHourlySalary &&
                        value <= selectedEmployee?.positionData.maxHourlySalary
                      : value >= selectedEmployee?.positionData.minHourlySalary
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      `The basic hourly salary must be greater than equal to ${
                        selectedEmployee?.positionData.minHourlySalary
                      } ${
                        selectedEmployee?.positionData.maxHourlySalary
                          ? ' and less than equal to ' +
                            selectedEmployee?.positionData.maxHourlySalary
                          : ''
                      }`,
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
                  ? `${selectedEmployee?.positionData.minHourlySalary} ${selectedEmployee?.positionData.currencyData.symbol}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    )
                  : ''
              }
              addonAfter={
                selectedEmployee?.positionData.maxHourlySalary
                  ? `${selectedEmployee?.positionData.maxHourlySalary} ${selectedEmployee?.positionData.currencyData.symbol}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    )
                  : ''
              }
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
          <Form.Item
            name="hourlyOvertimeSalary"
            label="Hourly Overtime Salary"
            hasFeedback
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            rules={[
              {
                required: true,
                message: "Please input the employee's hourly overtime salary!",
              },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    value > form.getFieldValue('basicHourlySalary')
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'Hourly Overtime Salary must be greater than Basic Hourly Salary!',
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
          <Form.Item name="allowance" label="Allowance" hasFeedback>
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
