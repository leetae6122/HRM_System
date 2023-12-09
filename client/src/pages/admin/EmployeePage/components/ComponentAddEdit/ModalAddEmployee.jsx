import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import EmployeeForm from './EmployeeForm';
import employeeApi from 'api/employeeApi';

ModalAddEmployee.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshEmployeeList: PropTypes.func,
};

ModalAddEmployee.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshEmployeeList: null,
};

function ModalAddEmployee(props) {
  const { openModal, toggleShowModal, refreshEmployeeList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddEmployee = async (values) => {
    try {
      setConfirmLoading(true);
      const response = await employeeApi.create(values);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshEmployeeList();
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
        title="Add Employee"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'150vh'}
        style={{ top: 30 }}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
      >
        <EmployeeForm
          onCancel={handleCancel}
          onSubmit={handleAddEmployee}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddEmployee;
