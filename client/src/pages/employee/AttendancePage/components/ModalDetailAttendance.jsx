import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import attendanceApi from 'api/attendanceApi';
import { getFullDate } from 'utils/handleDate';

ModalDetailAttendance.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalDetailAttendance.defaultProps = {
  openModal: false,
  toggleShowModal: null,
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
      ? `${data.employeeData.firstName} ${data.employeeData.lastName}`
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
    children: data.adminData.firstName
      ? `#${data.adminData.id} - ${data.adminData.firstName} ${data.adminData.lastName}`
      : '',
    span: 2,
  },
  {
    key: '13',
    label: 'Manager',
    children: data.managerData.firstName
      ? `#${data.managerData.id} - ${data.managerData.firstName} ${data.managerData.lastName}`
      : '',
    span: 2,
  },
];

function ModalDetailAttendance(props) {
  const { editAttendanceId } = useSelector((state) => state.attendance);
  const { openModal, toggleShowModal } = props;
  const [infoAttendance, setInfoAttendance] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editAttendanceId) {
          const data = (await attendanceApi.getById(editAttendanceId)).data;
          setInfoAttendance(data);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editAttendanceId]);

  const handleCancel = () => {
    toggleShowModal();
  };

  const items = infoAttendance ? createItems(infoAttendance) : [];

  return (
    <>
      <Modal
        title="Detail Attendance"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'110vh'}
        style={{ top: 30}}
      >
        <Descriptions layout="horizontal" bordered column={2} items={items} />
      </Modal>
    </>
  );
}
export default ModalDetailAttendance;
