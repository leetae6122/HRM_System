import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import RewardPunishmentForm from './RewardPunishmentForm';
import rewardPunishmentApi from 'api/rewardPunishmentApi';
import dayjs from 'dayjs';

ModalEditRewardPunishment.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshRewardPunishmentList: PropTypes.func,
};

ModalEditRewardPunishment.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshRewardPunishmentList: null,
};

function ModalEditRewardPunishment(props) {
  const { editRewardPunishmentId } = useSelector((state) => state.rewardPunishment);
  const { openModal, toggleShowModal, refreshRewardPunishmentList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editAllowance, setEditAllowance] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editRewardPunishmentId) {
          const data = (await rewardPunishmentApi.getById(editRewardPunishmentId)).data;
          setEditAllowance({
            rewardPunishmentId: data.id,
            type: data.type,
            reason: data.reason,
            amount: data.amount,
            date: dayjs(data.date),
            employeeId: data.employeeId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editRewardPunishmentId]);

  const handleEditAllowance = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(
        {
          ...values,
          endDate: values.endDate === '' ? null : values.endDate,
        },
        _.isNil,
      );
      const response = await rewardPunishmentApi.update(data);
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
        title="Edit"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{ top: 60 }}
      >
        {!_.isEmpty(editAllowance) && (
          <RewardPunishmentForm
            onCancel={handleCancel}
            onSubmit={handleEditAllowance}
            loading={confirmLoading}
            initialValues={editAllowance}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditRewardPunishment;
