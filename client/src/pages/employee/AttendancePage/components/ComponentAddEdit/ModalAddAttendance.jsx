import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import AttendanceForm from './AttendanceForm';
import { toast } from 'react-toastify';
import attendanceApi from 'api/attendanceApi';
import _ from 'lodash';

ModalAddAttendance.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshAttendanceList: PropTypes.func,
};

ModalAddAttendance.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshAttendanceList: null,
};

function ModalAddAttendance(props) {
  const { openModal, toggleShowModal, refreshAttendanceList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddAttendance = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await attendanceApi.employeeCreate(data);
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
        title="Add Attendance"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{
          top: 20
        }}
      >
        <AttendanceForm
          onCancel={handleCancel}
          onSubmit={handleAddAttendance}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddAttendance;
