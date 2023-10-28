import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, DatePicker, Select } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import shiftApi from 'api/shiftApi';

FilterAttendanceForm.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

FilterAttendanceForm.defaultProps = {
  onSubmit: null,
  loading: false,
};

const dateFormat = 'DD/MM/YYYY';

const wrapperCol = { offset: 8, span: 16 };

const initialValues = {
  minHourlySalary: {
    from: null,
    to: null,
  },
  maxHourlySalary: {
    from: null,
    to: null,
  },
  createdAt: [],
};

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

function FilterAttendanceForm(props) {
  const { onSubmit, loading } = props;
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
  }, [values, form]);

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
      name="normal_filter_position"
      className="filter_position-form"
      initialValues={initialValues}
      onFinish={onFinish}
      form={form}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 17 }}
      style={{
        maxWidth: 600,
      }}
      size="large"
    >
      <Form.Item name="attendanceDate" label="Attendance Date">
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

export default FilterAttendanceForm;
