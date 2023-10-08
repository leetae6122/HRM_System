import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import currencyApi from 'api/currencyApi';
import CurrencyForm from './CurrencyForm';
import { toast } from 'react-toastify';
import _ from 'lodash';

ModalAddCurrency.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshCurrencyList: PropTypes.func,
};

ModalAddCurrency.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshCurrencyList: null,
};

function ModalAddCurrency(props) {
  const { openModal, toggleShowModal, refreshCurrencyList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddCurrency = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.pickBy(values, _.identity);
      const response = await currencyApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshCurrencyList();
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
        title="Add Currency"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        <CurrencyForm
          onCancel={handleCancel}
          onSubmit={handleAddCurrency}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddCurrency;
