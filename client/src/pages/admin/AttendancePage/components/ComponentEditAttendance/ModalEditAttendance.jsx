import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import EditAttendanceForm from './EditAttendanceForm';
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
          setInfoAttendance(data);
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
        adminStatus: values.adminStatus,
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
        width={'110vh'}
        style={{
          top: 30
        }}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
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
