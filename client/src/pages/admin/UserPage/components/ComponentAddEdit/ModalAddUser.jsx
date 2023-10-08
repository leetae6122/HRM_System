import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import UserForm from './UserForm';
import userApi from 'api/userApi';
import _ from 'lodash';

ModalAddUser.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshUserList: PropTypes.func,
};

ModalAddUser.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshUserList: null,
};

function ModalAddUser(props) {
  const { openModal, toggleShowModal, refreshUserList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddUser = async (values) => {
    try {
      setConfirmLoading(true);
      delete values.confirmPassword;
      const data = _.omitBy(values, _.isNil);
      const response = await userApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshUserList();
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
        title="Add User"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
      >
        <UserForm
          onCancel={handleCancel}
          onSubmit={handleAddUser}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddUser;
