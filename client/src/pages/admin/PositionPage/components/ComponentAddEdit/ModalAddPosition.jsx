import { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setDefaultFilterData } from "reducers/position";
import { toast } from "react-toastify";
import positionApi from "api/positionApi";
import PositionForm from "./PositionForm";

ModalAddPosition.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalAddPosition.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalAddPosition(props) {
  const dispatch = useDispatch();
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddPosition = async (values) => {
    try {
      setConfirmLoading(true);
      const response = await positionApi.create(values);
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
        title="Add Position"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        <PositionForm
          onCancel={handleCancel}
          onSubmit={handleAddPosition}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddPosition;
