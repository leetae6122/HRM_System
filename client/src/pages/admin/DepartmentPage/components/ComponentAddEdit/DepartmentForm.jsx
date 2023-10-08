import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, Select } from 'antd';
import { toast } from 'react-toastify';
import _ from 'lodash';
import officeApi from 'api/officeApi';
import employeeApi from 'api/employeeApi';

DepartmentForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

DepartmentForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  initialValues: {
    name: '',
    shortName: '',
    officeId: null,
    managerId: '',
  },
};

const wrapperCol = { offset: 8, span: 16 };

function DepartmentForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
  const [officeOptions, setOfficeOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [submittable, setSubmittable] = useState(false);
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
    const fetchOfficeOptions = async () => {
      try {
        const response = await officeApi.getAll();
        const options = response.data.map((office) => ({
          value: office.id,
          label: office.title,
        }));
        setOfficeOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    const fetchEmployeeOptions = async () => {
      try {
        const response = await employeeApi.getAll();
        const options = response.data.map((employee) => ({
          value: employee.id,
          label: `${employee.firstName} ${employee.lastName}`,
        }));
        options.unshift({
          value: '',
          label: 'There is no manager',
        });
        setEmployeeOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchOfficeOptions();
    fetchEmployeeOptions();
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
      name="normal_department"
      className="department-form"
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
      {initialValues.departmentId ? (
        <Form.Item name="departmentId" label="Department Id">
          <Input disabled={true} />
        </Form.Item>
      ) : null}
      <Form.Item
        name="name"
        label="Name"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please input the name of the department!',
          },
        ]}
      >
        <Input
          placeholder="Enter department name"
          disabled={loading}
          showCount
          maxLength={40}
        />
      </Form.Item>
      <Form.Item
        name="shortName"
        label="Short Name"
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please input the short name of the department!',
          },
        ]}
      >
        <Input
          placeholder="Enter department short name"
          disabled={loading}
          showCount
          maxLength={8}
        />
      </Form.Item>
      <Form.Item
        name="officeId"
        label="Office"
        hasFeedback
        rules={[{ required: true, message: 'Please select office!' }]}
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
          options={officeOptions}
          disabled={loading}
        />
      </Form.Item>
      <Form.Item name="managerId" label="Manager" hasFeedback>
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
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button htmlType="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            {initialValues.departmentId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default DepartmentForm;
