import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import RewardPunishmentForm from './RewardPunishmentForm';
import rewardPunishmentApi from 'api/rewardPunishmentApi';
import _ from 'lodash';

ModalAddRewardPunishment.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshRewardPunishmentList: PropTypes.func,
};

ModalAddRewardPunishment.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshRewardPunishmentList: null,
};

function ModalAddRewardPunishment(props) {
  const { openModal, toggleShowModal, refreshRewardPunishmentList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddRewardPunishment = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await rewardPunishmentApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshRewardPunishmentList();
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
        title="Add Rewards or Punishments"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{ top: 60 }}
      >
        <RewardPunishmentForm
          onCancel={handleCancel}
          onSubmit={handleAddRewardPunishment}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddRewardPunishment;
