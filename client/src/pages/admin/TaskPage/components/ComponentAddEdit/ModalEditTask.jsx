import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import taskApi from 'api/taskApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import TaskForm from './TaskForm';

ModalEditTask.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshTaskList: PropTypes.func,
};

ModalEditTask.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshTaskList: null,
};

function ModalEditTask(props) {
  const { editTaskId } = useSelector((state) => state.task);
  const { openModal, toggleShowModal, refreshTaskList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editTask, setEditTask] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editTaskId) {
          const data = (await taskApi.getById(editTaskId)).data;
          setEditTask({
            taskId: data.id,
            title: data.title,
            describe: data.describe,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editTaskId]);

  const handleEditTask = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await taskApi.update(data);
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
        title="Edit Task"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        {!_.isEmpty(editTask) && (
          <TaskForm
            onCancel={handleCancel}
            onSubmit={handleEditTask}
            loading={confirmLoading}
            initialValues={editTask}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditTask;
