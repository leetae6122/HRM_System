import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import AddLeaveForm from './AddLeaveForm';
import { toast } from 'react-toastify';
import leaveApi from 'api/leaveApi';

ModalAddLeave.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshLeaveList: PropTypes.func,
};

ModalAddLeave.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshLeaveList: null,
};

function ModalAddLeave(props) {
  const { openModal, toggleShowModal, refreshLeaveList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddLeave = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        title: values.title,
        description: values.description,
        employeeId: values.employeeId,
        leaveFrom: values.rangeDateLeave[0],
        leaveTo: values.rangeDateLeave[1],
      };
      const response = await leaveApi.adminCreate(data);
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
        title="Create leave"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
      >
        <AddLeaveForm
          onCancel={handleCancel}
          onSubmit={handleAddLeave}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddLeave;
