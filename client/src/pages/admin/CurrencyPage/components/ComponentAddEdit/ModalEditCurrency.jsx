import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Swal from "sweetalert2";
import currencyApi from "api/currencyApi";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultFilterData } from "reducers/currency";
import { toast } from "react-toastify";
import _ from "lodash";
import CurrencyForm from "./CurrencyForm";

ModalEditCurrency.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalEditCurrency.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalEditCurrency(props) {
  const dispatch = useDispatch();
  const { editCurrencyId } = useSelector((state) => state.currency);
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editCurrency, setEditCurrency] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editCurrencyId) {
          const data = (await currencyApi.getById(editCurrencyId)).data;
          setEditCurrency({
            currencyId: data.id,
            name: data.name,
            code: data.code,
            symbol: data.symbol,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editCurrencyId]);

  const handleEditCurrency = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await currencyApi.update(data);
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
        title="Edit Currency"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        {!_.isEmpty(editCurrency) && (
          <CurrencyForm
            onCancel={handleCancel}
            onSubmit={handleEditCurrency}
            loading={confirmLoading}
            initialValues={editCurrency}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditCurrency;
