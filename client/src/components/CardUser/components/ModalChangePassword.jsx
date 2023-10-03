import { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import ChangePasswordForm from "./ChangePasswordForm";
import Swal from "sweetalert2";
import userApi from "api/userApi";

ModalChangePassword.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalChangePassword.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalChangePassword(props) {
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleChangePassword = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      const response = await userApi.changePassword(data);
      Swal.fire({
        icon: "success",
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: "Done",
      }).then((result) => {
        setConfirmLoading(false);
        if (result.isConfirmed) {
          toggleShowModal();
        }
      });
    } catch (error) {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    toggleShowModal();
  };

  return (
    <>
      <Modal
        title="Change Password"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        <ChangePasswordForm
          onCancel={handleCancel}
          onSubmit={handleChangePassword}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalChangePassword;
