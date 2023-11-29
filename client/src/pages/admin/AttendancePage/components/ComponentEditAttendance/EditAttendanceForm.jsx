import PropTypes from 'prop-types';
import { Form, Button, Space, Descriptions, Typography } from 'antd';
import { getFullDate } from 'utils/handleDate';

EditAttendanceForm.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  infoAttendance: PropTypes.object,
};

EditAttendanceForm.defaultProps = {
  onCancel: null,
  onSubmit: null,
  loading: false,
  infoAttendance: {},
};

const createItems = (data) => [
  {
    key: '1',
    label: 'Attendance Id',
    children: data.id,
  },
  {
    key: '2',
    label: 'Attendance Date',
    children: getFullDate(data.attendanceDate),
  },
  {
    key: '3',
    label: 'Employee Name',
    children: data
      ? `${data.employeeData.lastName} ${data.employeeData.firstName}`
      : '',
    span: 2,
  },
  {
    key: '4',
    label: 'Shifts',
    children: `${data.shiftData.name} (${data.shiftData.startTime} - ${data.shiftData.endTime})`,
    span: 2,
  },
  {
    key: '5',
    label: 'Login Time',
    children: data.inTime,
  },
  {
    key: '6',
    label: 'Logout Time',
    children: data.outTime,
  },
  {
    key: '7',
    label: 'Status (Login)',
    children: (
      <span
        style={{
          color:
            data.inStatus === 'Late In'
              ? 'red'
              : data.inStatus === 'On Time'
              ? 'green'
              : '',
        }}
      >
        {data.inStatus}
      </span>
    ),
  },
  {
    key: '8',
    label: 'Status (Logout)',
    children: (
      <span
        style={{
          color:
            data.outStatus === 'Out Early'
              ? 'red'
              : data.outStatus === 'On Time'
              ? 'green'
              : '',
        }}
      >
        {data.outStatus}
      </span>
    ),
  },
  {
    key: '9',
    label: 'Processing Status (Manager)',
    children: (
      <span
        style={{
          color:
            data.managerStatus === 'Reject'
              ? 'red'
              : data.managerStatus === 'Approved'
              ? 'green'
              : 'orange',
        }}
      >
        {data.managerStatus}
      </span>
    ),
  },
  {
    key: '10',
    label: 'Processing Status (Admin)',
    children: (
      <span
        style={{
          color:
            data.adminStatus === 'Reject'
              ? 'red'
              : data.adminStatus === 'Approved'
              ? 'green'
              : 'orange',
        }}
      >
        {data.adminStatus}
      </span>
    ),
  },
  {
    key: '11',
    label: 'Total hours',
    children: data.totalHours
      ? `${data.totalHours} ${
          data.shiftData.overtimeShift ? 'overtime hours' : 'hours'
        }`
      : '',
  },
  {
    key: '12',
    label: 'Shift type',
    children: (
      <span
        style={{
          color: data.shiftData.overtimeShift ? 'orange' : 'green',
        }}
      >
        {data.shiftData.overtimeShift ? 'Overtime shift' : 'Main shift'}
      </span>
    ),
  },
  {
    key: '13',
    label: 'Admin',
    children: data.adminEId
      ? `#${data.adminData.id} - ${data.adminData.lastName} ${data.adminData.firstName}`
      : '',
    span: 2,
  },
  {
    key: '14',
    label: 'Manager',
    children: data.managerEId
      ? `#${data.managerData.id} - ${data.managerData.lastName} ${data.managerData.firstName}`
      : '',
    span: 2,
  },
];

const initialValues = {
  status: '',
};

const wrapperCol = { offset: 8, span: 16 };

function EditAttendanceForm(props) {
  const { onCancel, onSubmit, loading, infoAttendance } = props;
  const [form] = Form.useForm();

  const items = createItems(infoAttendance);

  const onFinish = (values) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <Descriptions
        layout="horizontal"
        bordered
        title={<Typography.Title level={4}>Info Attendance</Typography.Title>}
        column={2}
        items={items}
      />
      {infoAttendance.adminStatus === 'Pending' ? (
        <>
          <Form
            name="normal_admin_edit_attendance"
            className="admin-edit-attendance-form"
            initialValues={initialValues}
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{
              marginTop: 20,
              maxWidth: 600,
            }}
            size="large"
          >
            <Form.Item wrapperCol={wrapperCol}>
              <Space style={{ float: 'right' }}>
                <Button
                  htmlType="button"
                  onClick={handleCancel}
                  loading={loading}
                >
                  Cancel
                </Button>
                {infoAttendance.outTime ? (
                  <>
                    <Button
                      htmlType="submit"
                      type="primary"
                      danger
                      onClick={() => onFinish({ adminStatus: 'Reject' })}
                      loading={loading}
                    >
                      Reject
                    </Button>
                    <Button
                      htmlType="submit"
                      type="primary"
                      onClick={() => onFinish({ adminStatus: 'Approved' })}
                      loading={loading}
                    >
                      Approved
                    </Button>
                  </>
                ) : null}
              </Space>
            </Form.Item>
          </Form>
        </>
      ) : null}
    </div>
  );
}

export default EditAttendanceForm;
