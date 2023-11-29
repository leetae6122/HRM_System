import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import positionApi from 'api/positionApi';
import PositionForm from './PositionForm';

ModalEditPosition.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshPositionList: PropTypes.func,
};

ModalEditPosition.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshPositionList: null,
};

function ModalEditPosition(props) {
  const { editPositionId } = useSelector(
    (state) => state.position,
  );
  const { openModal, toggleShowModal, refreshPositionList } = props;
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
            minHourlyWage: data.minHourlyWage,
            maxHourlyWage: data.maxHourlyWage,
            departmentId: data.departmentId
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
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshPositionList();
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
      >
        {!_.isEmpty(editPosition) && (
          <PositionForm
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
export default ModalEditPosition;
