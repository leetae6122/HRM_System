import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import rewardPunishmentApi from 'api/rewardPunishmentApi';
import dayjs from 'dayjs';
import { numberWithDot } from 'utils/format';

ModalDetailRewardPunishment.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalDetailRewardPunishment.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

const createItems = (data) => [
  {
    key: '1',
    label: 'Id',
    children: data.id,
  },
  {
    key: '2',
    label: 'Type',
    children: (
      <span
        style={{
          color: data.type === 'Reward' ? 'green' : 'red',
        }}
      >
        {data.type}
      </span>
    ),
  },
  {
    key: '3',
    label: 'Reason',
    children: data.reason,
  },
  {
    key: '4',
    label: 'Amount',
    children: (
      <span
        style={{
          color: data.type === 'Reward' ? 'green' : 'red',
        }}
      >
        {`${numberWithDot(data.amount)} VNĐ`}
      </span>
    ),
  },
  {
    key: '5',
    label: 'Effective Date',
    children: dayjs(data.date).format('DD/MM/YYYY'),
  },
  {
    key: '6',
    label: 'Added By',
    children: data.adminEId
      ? `#${data.adderData.id} - ${data.adderData.lastName} ${data.adderData.firstName}`
      : '',
  },
];

function ModalDetailRewardPunishment(props) {
  const { editRewardPunishmentId } = useSelector(
    (state) => state.rewardPunishment,
  );
  const { openModal, toggleShowModal } = props;
  const [infoRewardPunishment, setInfoRewardPunishment] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editRewardPunishmentId) {
          const data = (
            await rewardPunishmentApi.getById(editRewardPunishmentId)
          ).data;
          setInfoRewardPunishment(data);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editRewardPunishmentId]);

  const handleCancel = () => {
    toggleShowModal();
  };

  const items = infoRewardPunishment ? createItems(infoRewardPunishment) : [];

  return (
    <>
      <Modal
        title="Detail Reward or Punishment"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
      >
        <Descriptions layout="horizontal" bordered column={1} items={items} />
      </Modal>
    </>
  );
}
export default ModalDetailRewardPunishment;
