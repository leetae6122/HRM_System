import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import OfficeForm from './OfficeForm';
import officeApi from 'api/officeApi';
import _ from 'lodash';

ModalAddOffice.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshOfficeList: PropTypes.func,
};

ModalAddOffice.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshOfficeList: null,
};

function ModalAddOffice(props) {
  const { openModal, toggleShowModal, refreshOfficeList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddOffice = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.pickBy(values, _.identity);
      const response = await officeApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshOfficeList()
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
        title="Add Office"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        style={{ top: 40 }}
      >
        <OfficeForm
          onCancel={handleCancel}
          onSubmit={handleAddOffice}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddOffice;
