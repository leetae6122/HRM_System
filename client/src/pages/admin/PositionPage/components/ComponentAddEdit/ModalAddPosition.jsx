import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import positionApi from 'api/positionApi';
import PositionForm from './PositionForm';
import _ from 'lodash';

ModalAddPosition.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshPositionList: PropTypes.func,
};

ModalAddPosition.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshPositionList: null,
};

function ModalAddPosition(props) {
  const { openModal, toggleShowModal, refreshPositionList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddPosition = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await positionApi.create(data);
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
        title="Add Position"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
      >
        <PositionForm
          onCancel={handleCancel}
          onSubmit={handleAddPosition}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddPosition;
