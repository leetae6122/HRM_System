import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import AddPayrollForm from './AddPayrollForm';
import { toast } from 'react-toastify';
import payrollApi from 'api/payrollApi';

ModalAddPayroll.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshPayrollList: PropTypes.func,
};

ModalAddPayroll.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshPayrollList: null,
};

function ModalAddPayroll(props) {
  const { openModal, toggleShowModal, refreshPayrollList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddPayroll = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        month: values.month,
        startDate: values.payrollDateRange[0],
        endDate: values.payrollDateRange[1],
        deductions: values.deductions,
        employeeId: values.employeeId,
      };
      const response = await payrollApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshPayrollList();
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
        title="Create Payroll"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
      >
        <AddPayrollForm
          onCancel={handleCancel}
          onSubmit={handleAddPayroll}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddPayroll;
