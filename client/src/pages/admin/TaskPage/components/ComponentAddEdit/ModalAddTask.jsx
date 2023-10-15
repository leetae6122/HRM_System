import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import taskApi from 'api/taskApi';
import TaskForm from './TaskForm';
import { toast } from 'react-toastify';
import _ from 'lodash';

ModalAddTask.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshTaskList: PropTypes.func,
};

ModalAddTask.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshTaskList: null,
};

function ModalAddTask(props) {
  const { openModal, toggleShowModal, refreshTaskList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddCurrency = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.pickBy(values, _.identity);
      const response = await taskApi.create(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshTaskList();
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
        title="Add Task"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        <TaskForm
          onCancel={handleCancel}
          onSubmit={handleAddCurrency}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddTask;
