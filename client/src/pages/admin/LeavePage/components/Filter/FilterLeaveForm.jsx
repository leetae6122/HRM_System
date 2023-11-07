import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, DatePicker, Select } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import employeeApi from 'api/employeeApi';
import { toast } from 'react-toastify';

FilterLeaveForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

FilterLeaveForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    leaveFrom: [],
    leaveTo: [],
    employeeId: null,
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

function FilterLeaveForm(props) {
  const { onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    const controller = new AbortController();
    const fetchEmployeeOptions = async () => {
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
    fetchEmployeeOptions();
    return () => controller.abort();
  }, []);

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

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="normal_filter_attendance"
      className="filter_attendance-form"
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
      <Form.Item name="employeeId" label="Employee">
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
      <Form.Item name="leaveFrom" label="Leave From">
        <DatePicker.RangePicker
          disabled={loading}
          format={dateFormat}
          style={{
            width: '100%',
          }}
          presets={rangePresets}
        />
      </Form.Item>
      <Form.Item name="leaveTo" label="Leave To">
        <DatePicker.RangePicker
          disabled={loading}
          format={dateFormat}
          style={{
            width: '100%',
          }}
          presets={rangePresets}
        />
      </Form.Item>
      <Form.Item wrapperCol={wrapperCol}>
        <Space style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit" disabled={!submittable}>
            Filter
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default FilterLeaveForm;
