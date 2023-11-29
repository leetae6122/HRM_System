import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Space, Select } from 'antd';
import { toast } from 'react-toastify';
import _ from 'lodash';
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
    managerEId: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function DepartmentForm(props) {
  const { onCancel, onSubmit, loading, initialValues } = props;
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
    const fetchEmployeeOptions = async () => {
      try {
        const response = await employeeApi.getAll();
        const options = response.data.map((employee) => ({
          value: employee.id,
          label: `#${employee.id} - ${employee.lastName} ${employee.firstName}`,
        }));
        options.unshift({
          value: '',
          label: '# No manager',
        });
        setEmployeeOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
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
          <Input
            disabled={true}
            style={{
              color: 'black',
            }}
          />
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
      <Form.Item name="managerEId" label="Manager" hasFeedback>
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
          <Button htmlType="button" onClick={handleCancel} loading={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!submittable}
          >
            {initialValues.departmentId ? 'Save' : 'Add'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default DepartmentForm;
