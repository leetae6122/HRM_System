import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import projectApi from 'api/projectApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import ProjectForm from './ProjectForm';
import dayjs from 'dayjs';

ModalEditProject.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshProjectList: PropTypes.func,
};

ModalEditProject.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshProjectList: null,
};

function ModalEditProject(props) {
  const { editProjectId } = useSelector((state) => state.project);
  const { openModal, toggleShowModal, refreshProjectList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editProject, setEditProject] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editProjectId) {
          const data = (await projectApi.getById(editProjectId)).data;
          setEditProject({
            projectId: data.id,
            title: data.title,
            summary: data.summary,
            detail: data.detail ?? '',
            startDate: dayjs(data.startDate),
            endDate: data.endDate ? dayjs(data.endDate) : '',
            status: data.status,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editProjectId]);

  const handleEditProject = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await projectApi.update(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshProjectList();
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
        title="Edit Project"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        style={{
          top: 40,
        }}
      >
        {!_.isEmpty(editProject) && (
          <ProjectForm
            onCancel={handleCancel}
            onSubmit={handleEditProject}
            loading={confirmLoading}
            initialValues={editProject}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditProject;
