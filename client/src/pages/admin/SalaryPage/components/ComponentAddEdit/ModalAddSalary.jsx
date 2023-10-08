import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import SalaryForm from './SalaryForm';
import salaryApi from 'api/salaryApi';
import _ from 'lodash';

ModalAddSalary.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshSalaryList: PropTypes.func,
};

ModalAddSalary.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshSalaryList: null,
};

function ModalAddSalary(props) {
  const { openModal, toggleShowModal, refreshSalaryList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddSalary = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await salaryApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshSalaryList();
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
        title="Add Salary"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        <SalaryForm
          onCancel={handleCancel}
          onSubmit={handleAddSalary}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddSalary;
