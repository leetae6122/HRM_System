import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import DepartmentForm from './DepartmentForm';
import departmentApi from 'api/departmentApi';
import _ from 'lodash';

ModalAddDepartment.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshDepartmentList: PropTypes.func,
};

ModalAddDepartment.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshDepartmentList: null,
};

function ModalAddDepartment(props) {
  const { openModal, toggleShowModal, refreshDepartmentList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddDepartment = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.pickBy(values, _.identity);
      const response = await departmentApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshDepartmentList();
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
        title="Add Department"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        <DepartmentForm
          onCancel={handleCancel}
          onSubmit={handleAddDepartment}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddDepartment;
