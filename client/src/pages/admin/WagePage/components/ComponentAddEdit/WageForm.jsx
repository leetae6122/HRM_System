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

WageForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

WageForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    basicHourlyWage: 0,
    fromDate: '',
    toDate: '',
    employeeId: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };
const dateFormat = 'DD/MM/YYYY';

function WageForm(props) {
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
      basicHourlyWage: initialValues.basicHourlyWage,
      fromDate: initialValues.fromDate,
      toDate: initialValues.toDate,
      wageId: initialValues.wageId,
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
          label: `#${employee.id} - ${employee.lastName} ${employee.firstName}`,
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
      if (initialValues.wageId) {
        const data = (await employeeApi.getById(initialValues.employeeId)).data;
        setSelectedEmployee(data);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [initialValues.wageId, initialValues.employeeId]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form
      name="normal_wage"
      className="wage-form"
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
      {initialValues.wageId ? (
        <Form.Item name="wageId" label="Wage Id">
          <Input
            disabled={true}
            style={{
              color: 'black',
            }}
          />
        </Form.Item>
      ) : null}
      {initialValues.wageId ? (
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
            name="basicHourlyWage"
            label="Basic Hourly Wage"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input the employee's basic hourly wage!",
              },
              () => ({
                validator(_, value) {
                  if (!value || (value && form.getFieldValue('employeeId'))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'Please select an employee before entering your basic hourly wage!',
                    ),
                  );
                },
              }),
              () => ({
                validator(_, value) {
                  if (
                    !value || selectedEmployee?.positionData.maxHourlyWage
                      ? value >= selectedEmployee?.positionData.minHourlyWage &&
                        value <= selectedEmployee?.positionData.maxHourlyWage
                      : value >= selectedEmployee?.positionData.minHourlyWage
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      `The basic hourly wage must be greater than equal to ${
                        selectedEmployee?.positionData.minHourlyWage
                      } ${
                        selectedEmployee?.positionData.maxHourlyWage
                          ? ' and less than equal to ' +
                            selectedEmployee?.positionData.maxHourlyWage
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
                  ? `${selectedEmployee?.positionData.minHourlyWage} VNĐ/hr`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    )
                  : ''
              }
              addonAfter={
                selectedEmployee?.positionData.maxHourlyWage
                  ? `${selectedEmployee?.positionData.maxHourlyWage} VNĐ/hr`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ',',
                    )
                  : ''
              }
              formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>
          <Form.Item
            name="fromDate"
            label="From Date"
            hasFeedback
            rules={[{ required: true, message: 'Please select from date!' }]}
          >
            <DatePicker
              disabled={loading}
              format={dateFormat}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          {initialValues.wageId ? (
            <Form.Item name="toDate" label="To Date" hasFeedback>
              <DatePicker
                disabled={loading}
                format={dateFormat}
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>
          ) : null}
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
            {initialValues.wageId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default WageForm;
