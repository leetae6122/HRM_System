import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import leaveApi from 'api/leaveApi';
import LeaveForm from './LeaveForm';
import dayjs from 'dayjs';

ModalEditLeave.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshLeaveList: PropTypes.func,
};

ModalEditLeave.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshLeaveList: null,
};

function ModalEditLeave(props) {
  const { editLeaveId } = useSelector((state) => state.leave);
  const { openModal, toggleShowModal, refreshLeaveList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editLeave, setEditLeave] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editLeaveId) {
          const data = (await leaveApi.getById(editLeaveId)).data;
          setEditLeave({
            leaveId: data.id,
            title: data.title,
            description: data.description,
            rangeDateLeave: [dayjs(data.leaveFrom), dayjs(data.leaveTo)],
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editLeaveId]);

  const handleEditLeave = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        leaveId: values.leaveId,
        title: values.title,
        description: values.description,
        leaveFrom: values.rangeDateLeave[0],
        leaveTo: values.rangeDateLeave[1],
      };
      const response = await leaveApi.employeeUpdate(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshLeaveList();
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
        title="Edit Leave"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={"100vh"}
      >
        {!_.isEmpty(editLeave) && (
          <LeaveForm
            onCancel={handleCancel}
            onSubmit={handleEditLeave}
            loading={confirmLoading}
            initialValues={editLeave}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditLeave;
