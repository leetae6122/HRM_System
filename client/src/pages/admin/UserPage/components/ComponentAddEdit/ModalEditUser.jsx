import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultFilterData } from "reducers/user";
import { toast } from "react-toastify";
import _ from "lodash";
import UserForm from "./UserForm";
import userApi from "api/userApi";

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
  const { editUserId } = useSelector((state) => state.user);
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editUser, setEditUser] = useState({});
  
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editUserId) {
          const data = (await userApi.getById(editUserId)).data;
          setEditUser({
            userId: data.id,
            username: data.username,
            password: data.password,
            isAdmin: !!data.isAdmin,
            isActived: !!data.isActived,
            employeeId: data.employeeId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editUserId]);

  const handleEditUser = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await userApi.update(data);
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
        title="Edit User"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={"100vh"}
      >
        {!_.isEmpty(editUser) && (
          <UserForm
            onCancel={handleCancel}
            onSubmit={handleEditUser}
            loading={confirmLoading}
            initialValues={editUser}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditUser;
