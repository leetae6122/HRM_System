import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setDefaultFilterData } from "reducers/employee";
import { toast } from "react-toastify";
import EmployeeForm from "./EmployeeForm";
import employeeApi from "api/employeeApi";

ModalAddEmployee.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalAddEmployee.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalAddEmployee(props) {
  const dispatch = useDispatch();
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddEmployee = async (values) => {
    try {
      setConfirmLoading(true);
      const response = await employeeApi.create(values);
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
        title="Add Employee"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={"100vh"}
        style={{ top: 40 }}
      >
        <EmployeeForm
          onCancel={handleCancel}
          onSubmit={handleAddEmployee}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddEmployee;
