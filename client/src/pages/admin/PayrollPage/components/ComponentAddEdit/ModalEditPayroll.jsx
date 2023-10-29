import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import payrollApi from 'api/payrollApi';
import EditPayrollForm from './EditPayrollForm';

ModalEditPayroll.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshPayrollList: PropTypes.func,
};

ModalEditPayroll.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshPayrollList: null,
};

function ModalEditPayroll(props) {
  const { editPayrollId } = useSelector((state) => state.payroll);
  const { openModal, toggleShowModal, refreshPayrollList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [infoPayroll, setInfoPayroll] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editPayrollId) {
          const data = (await payrollApi.getById(editPayrollId)).data;
          setInfoPayroll(data);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editPayrollId]);

  const handleEditPayroll = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        payrollId: editPayrollId,
        status: values.status,
        payDate: values.payDate,
        deduction: values.deduction,
      };
      const response = await payrollApi.update(data);
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
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
      >
        {!_.isEmpty(infoPayroll) && (
          <EditPayrollForm
            onCancel={handleCancel}
            onSubmit={handleEditPayroll}
            loading={confirmLoading}
            infoPayroll={infoPayroll}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditPayroll;
