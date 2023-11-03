import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import AllowanceForm from './AllowanceForm';
import allowanceApi from 'api/allowanceApi';
import _ from 'lodash';

ModalAddAllowance.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshAllowanceList: PropTypes.func,
};

ModalAddAllowance.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshAllowanceList: null,
};

function ModalAddAllowance(props) {
  const { openModal, toggleShowModal, refreshAllowanceList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddAllowance = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(
        {
          ...values,
          endDate: values.endDate === '' ? null : values.endDate,
        },
        _.isNil,
      );
      const response = await allowanceApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshAllowanceList();
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
        title="Add Allowance"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{ top: 60 }}
      >
        <AllowanceForm
          onCancel={handleCancel}
          onSubmit={handleAddAllowance}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddAllowance;