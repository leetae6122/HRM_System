import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import shiftApi from 'api/shiftApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import ShiftForm from './ShiftForm';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

ModalEditShift.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshShiftList: PropTypes.func,
};

ModalEditShift.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshShiftList: null,
};

function ModalEditShift(props) {
  const { editShiftId } = useSelector((state) => state.shift);
  const { openModal, toggleShowModal, refreshShiftList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editShift, setEditShift] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editShiftId) {
          const data = (await shiftApi.getById(editShiftId)).data;
          setEditShift({
            shiftId: data.id,
            name: data.name,
            rangeTime:[dayjs(data.startTime, 'HH:mm:ss'),dayjs(data.endTime, 'HH:mm:ss')],
            overtimeShift: !!data.overtimeShift,
            days: data.days,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editShiftId]);

  const handleEditShift = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        shiftId: values.shiftId,
        name: values.name,
        startTime: values.rangeTime[0].second(0),
        endTime: values.rangeTime[1].second(0),
        overtimeShift: values.overtimeShift,
        days: values.days,
      }
      const response = await shiftApi.update(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshShiftList();
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
        title="Edit Shift"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        {!_.isEmpty(editShift) && (
          <ShiftForm
            onCancel={handleCancel}
            onSubmit={handleEditShift}
            loading={confirmLoading}
            initialValues={editShift}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditShift;
