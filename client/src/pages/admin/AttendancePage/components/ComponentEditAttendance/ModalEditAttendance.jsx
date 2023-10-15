import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import EditAttendanceForm from './EditAttendanceForm';
import { getFullDate } from 'utils/handleDate';
import attendanceApi from 'api/attendanceApi';

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
  const [infoAttendance, setInfoAttendance] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editAttendanceId) {
          const data = (await attendanceApi.getById(editAttendanceId)).data;
          setInfoAttendance({
            attendanceId: data.id,
            description: data.description,
            attendanceDate: getFullDate(data.attendanceDate),
            hourSpent: data.hourSpent,
            hourOT: data.hourOT,
            status: data.status,
            place: data.place,
            employeeData: data.employeeData,
            handlerData: data.handlerData,
            taskData: data.taskData,
            projectData: data.projectData,
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
      const data = {
        attendanceId: editAttendanceId,
        status: values.status,
      };
      const response = await attendanceApi.adminUpdate(data);
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
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{
          top: 40
        }}
      >
        {!_.isEmpty(infoAttendance) && (
          <EditAttendanceForm
            onCancel={handleCancel}
            onSubmit={handleEditAttendance}
            loading={confirmLoading}
            infoAttendance={infoAttendance}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditAttendance;
