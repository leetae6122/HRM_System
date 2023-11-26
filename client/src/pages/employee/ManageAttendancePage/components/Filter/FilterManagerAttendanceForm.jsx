import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, DatePicker, Select } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import shiftApi from 'api/shiftApi';

FilterManagerAttendanceForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
};

FilterManagerAttendanceForm.defaultProps = {
  onSubmit: null,
  loading: false,
  initialValues: {
    attendanceDate: '',
    shiftId: null,
  },
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

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

function FilterManagerAttendanceForm(props) {
  const { onSubmit, loading, initialValues } = props;
  const [submittable, setSubmittable] = useState(false);
  const [shiftOptions, setShiftOptions] = useState([]);

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
  }, [values, initialValues, form]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await shiftApi.getAll();
        const options = response.data.map((shift) => ({
          value: shift.id,
          label: `${shift.name} (${shift.startTime} - ${shift.endTime})`,
        }));
        setShiftOptions(options);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      name="normal_filter_manager_attendance"
      className="filter-manager-attendance-form"
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
        label="Attendance Date"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
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
      <Form.Item name="shiftId" label="Shifts">
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

export default FilterManagerAttendanceForm;
