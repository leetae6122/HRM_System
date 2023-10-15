import PropTypes from 'prop-types';
import { Form, Button, Space, Descriptions, Typography } from 'antd';

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
  infoAttendance: {
    attendanceId: null,
    description: '',
    attendanceDate: '',
    hourSpent: 0,
    hourOT: 0,
    status: '',
    place: '',
    employeeData: null,
    taskData: null,
    projectData: null,
  },
};

const createItems = (data) => [
  {
    key: '1',
    label: 'Attendance Id',
    children: data.attendanceId,
  },
  {
    key: '2',
    label: 'Employee Name',
    children: `${data.employeeData.firstName} ${data.employeeData.lastName}`,
    span: 2,
  },
  {
    key: '3',
    label: 'Status',
    children: (
      <span
        style={{
          color:
            data.status === 'Reject'
              ? 'red'
              : data.status === 'Approved'
              ? 'green'
              : '',
        }}
      >
        {data.status}
      </span>
    ),
  },
  {
    key: '4',
    label: 'Handler Name',
    children: data.handlerData.firstName
      ? `${data.handlerData.firstName} ${data.handlerData.lastName}`
      : '',
    span: 2,
  },
  {
    key: '5',
    label: 'Project',
    children: data.projectData?.title,
    span: 3,
  },
  {
    key: '6',
    label: 'Task',
    children: data.taskData?.title,
    span: 3,
  },
  {
    key: '7',
    label: 'Description',
    children: data.description.split('\n').map(function (item, idx) {
      return (
        <span key={idx}>
          {item}
          <br />
        </span>
      );
    }),
    span: 3,
  },
  {
    key: '8',
    label: 'Place',
    children: data.place,
  },
  {
    key: '9',
    label: 'Attendance Date',
    children: data.attendanceDate,
    span: 2,
  },
  {
    key: '10',
    label: 'Hour Spent',
    children: `${data.hourSpent} hr`,
  },
  {
    key: '11',
    label: 'Hour OT',
    children: `${data.hourOT ? data.hourOT : 0} hr`,
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
        column={3}
        items={items}
      />
      {infoAttendance.status === 'Pending' ? (
        <>
          <Form
            name="normal_edit_attendance"
            className="edit-attendance-form"
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
                <Button
                  htmlType="submit"
                  type="primary"
                  danger
                  onClick={() => onFinish({ status: 'Reject' })}
                  loading={loading}
                >
                  Reject
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  onClick={() => onFinish({ status: 'Approved' })}
                  loading={loading}
                >
                  Approved
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      ) : null}
    </div>
  );
}

export default EditAttendanceForm;
