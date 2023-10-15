import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import projectApi from 'api/projectApi';
import ProjectForm from './ProjectForm';
import { toast } from 'react-toastify';
import _ from 'lodash';

ModalAddProject.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshProjectList: PropTypes.func,
};

ModalAddProject.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshProjectList: null,
};

function ModalAddProject(props) {
  const { openModal, toggleShowModal, refreshProjectList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleAddProject = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.pickBy(values, _.identity);
      const response = await projectApi.create(data);
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
        title="Add Project"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        style={{
          top: 40
        }}
      >
        <ProjectForm
          onCancel={handleCancel}
          onSubmit={handleAddProject}
          loading={confirmLoading}
        />
      </Modal>
    </>
  );
}
export default ModalAddProject;
