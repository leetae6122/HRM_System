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
    label: 'Employee Name',
    children: data
      ? `${data.employeeData.firstName} ${data.employeeData.lastName}`
      : '',
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
    children: data.handlerData
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
    children: getFullDate(data.attendanceDate),
    span: 2,
  },
  {
    key: '10',
    label: 'Hours Spent',
    children: `${data.hoursSpent} hr`,
  },
  {
    key: '11',
    label: 'Hours Overtime',
    children: `${data.hoursOvertime ? data.hoursOvertime : 0} hr`,
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
        width={'100vh'}
      >
        <Descriptions layout="horizontal" bordered column={2} items={items} />
      </Modal>
    </>
  );
}
export default ModalDetailAttendance;
