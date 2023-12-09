import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import shiftApi from 'api/shiftApi';
import ShiftForm from './ShiftForm';
import { toast } from 'react-toastify';

ModalAddShift.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshShiftList: PropTypes.func,
};

ModalAddShift.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshShiftList: null,
};

function ModalAddShift(props) {
  const { openModal, toggleShowModal, refreshShiftList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddShift = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        name: values.name,
        startTime: values.rangeTime[0],
        endTime: values.rangeTime[1],
        overtimeShift: values.overtimeShift,
        days: values.days,
      }
      const response = await shiftApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshShiftList();
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
        title="Add Shift"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
      >
        <ShiftForm
          onCancel={handleCancel}
          onSubmit={handleAddShift}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddShift;
