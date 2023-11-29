import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import employeeApi from "api/employeeApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import userApi from "api/userApi";
import { login } from "reducers/auth";
import EditProfileForm from "./EditProfileForm";
import _ from "lodash";
import dayjs from "dayjs";

ModalEditProfile.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalEditProfile.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalEditProfile(props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editProfile, setEditProfile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await employeeApi.getById(user.profile.id)).data;
        setEditProfile({
          ...data,
          gender: !!data.gender,
          dateBirth: dayjs(data.dateBirth),
        });
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, [user.profile.id]);

  const handleEditProfile = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await employeeApi.updatePersonal(data);
      Swal.fire({
        icon: "success",
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: "Done",
      }).then(async (result) => {
        const data = (await userApi.getUserProfile()).data;
        dispatch(login(data));
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
        title="Edit Profile"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={"100vh"}
      >
        {!_.isEmpty(editProfile) && (
          <EditProfileForm
            onCancel={handleCancel}
            onSubmit={handleEditProfile}
            loading={confirmLoading}
            initialValues={editProfile}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditProfile;
