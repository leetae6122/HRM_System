import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import attendanceApi from 'api/attendanceApi';
import AttendanceForm from './AttendanceForm';
import dayjs from 'dayjs';

ModalEditAttendance.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshAttendanceList: PropTypes.func,
};

ModalEditAttendance.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshAttendanceList: null,
};

function ModalEditAttendance(props) {
  const { editAttendanceId } = useSelector((state) => state.attendance);
  const { openModal, toggleShowModal, refreshAttendanceList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editAttendance, setEditAttendance] = useState({});


  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editAttendanceId) {
          const data = (await attendanceApi.getById(editAttendanceId)).data;
          setEditAttendance({
            attendanceId: data.id,
            description: data.description,
            attendanceDate: dayjs(data.attendanceDate),
            hoursSpent: data.hoursSpent,
            hoursOvertime: data.hoursOvertime ?? 0,
            status: data.status,
            place: data.place,
            taskId: data.taskId,
            projectId: data.projectId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editAttendanceId]);

  const handleEditAttendance = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await attendanceApi.employeeUpdate(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshAttendanceList();
        setConfirmLoading(false);
        if (result.isConfirmed) {
          toggleShowModal();
        }
      });
    } catch (error) {
      toast.error(error);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    toggleShowModal();
  };

  return (
    <>
      <Modal
        title="Edit Attendance"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{
          top: 20,
        }}
      >
        {!_.isEmpty(editAttendance) && (
          <AttendanceForm
            onCancel={handleCancel}
            onSubmit={handleEditAttendance}
            loading={confirmLoading}
            initialValues={editAttendance}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditAttendance;
