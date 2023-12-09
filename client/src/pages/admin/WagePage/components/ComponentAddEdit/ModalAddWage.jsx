import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import WageForm from './WageForm';
import wageApi from 'api/wageApi';
import _ from 'lodash';

ModalAddWage.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshWageList: PropTypes.func,
};

ModalAddWage.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshWageList: null,
};

function ModalAddWage(props) {
  const { openModal, toggleShowModal, refreshWageList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddWage = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await wageApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshWageList();
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
        title="Add Wage"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={"100vh"}
        style={{ top: 60 }}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
      >
        <WageForm
          onCancel={handleCancel}
          onSubmit={handleAddWage}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddWage;
