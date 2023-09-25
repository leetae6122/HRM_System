import React, { useState } from "react";
import PropsTypes from "prop-types";
import { Modal } from "antd";
import Swal from "sweetalert2";
import currencyApi from "api/currencyApi";
import AddCurrencyForm from "./AddCurrencyForm";
import { useDispatch } from "react-redux";
import { setDefaultFilterData } from "reducers/currency";
import { toast } from "react-toastify";

ModalAddCurrency.propTypes = {
  openModal: PropsTypes.bool,
  toggleShowModal: PropsTypes.func,
};

ModalAddCurrency.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalAddCurrency(props) {
  const dispatch = useDispatch();
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const handleAddCurrency = async (values) => {
    try {
      setConfirmLoading(true);
      const response = await currencyApi.create(values);
      Swal.fire({
        icon: "success",
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: "Done",
      }).then((result) => {
        dispatch(setDefaultFilterData());
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
        closable={false}
        maskClosable={false}
        footer={null}
      >
        <AddCurrencyForm
          onCancel={handleCancel}
          onSubmit={handleAddCurrency}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddCurrency;
