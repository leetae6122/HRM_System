import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import countryApi from 'api/countryApi';
import CountryForm from './CountryForm';

ModalAddCountry.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshCountryList: PropTypes.func,
};

ModalAddCountry.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshCountryList: null,
};

function ModalAddCountry(props) {
  const { openModal, toggleShowModal, refreshCountryList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddCountry = async (values) => {
    try {
      setConfirmLoading(true);
      const response = await countryApi.create(values);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshCountryList();
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
        title="Add Country"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
      >
        <CountryForm
          onCancel={handleCancel}
          onSubmit={handleAddCountry}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddCountry;
