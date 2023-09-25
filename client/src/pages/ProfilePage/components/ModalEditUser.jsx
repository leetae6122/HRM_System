import React, { useState } from "react";
import PropsTypes from "prop-types";
import { Button, Modal } from "antd";

ModalEditUser.propTypes = {
  openModal: PropsTypes.bool,
  handleShowModal: PropsTypes.func,
};

ModalEditUser.defaultProps = {
  openModal: false,
  handleShowModal: null,
};

function ModalEditUser(props) {
  const { openModal, handleShowModal } = props;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal with async logic
      </Button>
      <Modal
        title="Title"
        open={openModal}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}
export default ModalEditUser;
