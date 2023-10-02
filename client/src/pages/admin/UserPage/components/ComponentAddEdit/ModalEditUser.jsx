import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultFilterData } from "reducers/position";
import { toast } from "react-toastify";
import _ from "lodash";
import positionApi from "api/positionApi";
import UserForm from "./UserForm";

ModalEditUser.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalEditUser.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalEditUser(props) {
  const dispatch = useDispatch();
  const { editPositionId } = useSelector((state) => state.position);
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editPosition, setEditPosition] = useState({});
  
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editPositionId) {
          const data = (await positionApi.getById(editPositionId)).data;
          setEditPosition({
            positionId: data.id,
            name: data.name,
            minSalary: data.minSalary,
            maxSalary: data.maxSalary,
            currencyId: data.currencyId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editPositionId]);

  const handleEditPosition = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await positionApi.update(data);
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
        title="Edit Position"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={"100vh"}
      >
        {!_.isEmpty(editPosition) && (
          <UserForm
            onCancel={handleCancel}
            onSubmit={handleEditPosition}
            loading={confirmLoading}
            initialValues={editPosition}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditUser;
