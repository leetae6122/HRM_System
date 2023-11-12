import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, DatePicker, Select } from 'antd';
import _ from 'lodash';
import { getMonthName } from 'utils/handleDate';
import employeeApi from 'api/employeeApi';
import shiftApi from 'api/shiftApi';
import { toast } from 'react-toastify';

FilterAttendanceForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

FilterAttendanceForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    attendanceDate: '',
    employeeId: null,
    shiftId: null,
  },
};

const wrapperCol = { offset: 8, span: 16 };

function FilterAttendanceForm(props) {
  const { onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
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
    const fetchShiftOptions = async () => {
      try {
        const data = (await shiftApi.getAll()).data;
        const options = data.map((shift) => ({
          value: shift.id,
          label: `${shift.name} (${shift.startTime} - ${shift.endTime})`,
        }));
        setShiftOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchEmployeeOptions();
    fetchShiftOptions();
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
      <Form.Item
        name="attendanceDate"
        label="Attendance Date (Month)"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
      >
        <DatePicker
          picker="month"
          allowClear={false}
          format={(value) => getMonthName(value)}
          disabled={loading}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
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
      <Form.Item name="shiftId" label="Shift">
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
          options={shiftOptions}
          disabled={loading}
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

export default FilterAttendanceForm;
