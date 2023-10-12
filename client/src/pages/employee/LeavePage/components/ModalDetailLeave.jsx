import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import leaveApi from 'api/leaveApi';
import dayjs from 'dayjs';

ModalDetailLeave.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalDetailLeave.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

const createItems = (value) => [
  {
    key: '1',
    label: 'Leave Id',
    children: value.id,
  },
  {
    key: '2',
    label: 'Handler',
    children: value.handledBy
      ? `${value.handlerData.firstName} ${value.handlerData.lastName}`
      : '',
  },
  {
    key: '3',
    label: 'Status',
    children: (
      <span style={{ color: value.status === 'Reject' ? 'red' : 'green' }}>
        {value.status}
      </span>
    ),
  },
  {
    key: '4',
    label: 'Date processing',
    children: dayjs(value.updatedAt).format('YYYY-MM-DD HH:mm'),
  },
  {
    key: '5',
    label: 'Title',
    children: value.title,
    span: 2,
  },
  {
    key: '6',
    label: 'Description',
    children: value.description,
    span: 2,
  },
  {
    key: '7',
    label: 'Leave From',
    children: value.leaveFrom,
  },
  {
    key: '8',
    label: 'Leave To',
    children: value.leaveTo,
  },
  {
    key: '6',
    label: 'Reasons for rejection',
    children: value.reasonRejection,
    span: 2,
  },
];

function ModalDetailLeave(props) {
  const { editLeaveId } = useSelector((state) => state.leave);
  const { openModal, toggleShowModal } = props;
  const [infoLeave, setInfoLeave] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editLeaveId) {
          const data = (await leaveApi.getById(editLeaveId)).data;
          setInfoLeave(data);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editLeaveId]);

  const handleCancel = () => {
    toggleShowModal();
  };

  const items = createItems(infoLeave);

  return (
    <>
      <Modal
        title="Detail Leave"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={"100vh"}
      >
        <Descriptions
          layout="horizontal"
          bordered
          column={2}
          items={items}
        />
      </Modal>
    </>
  );
}
export default ModalDetailLeave;
