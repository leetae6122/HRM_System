import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import DepartmentForm from './DepartmentForm';
import departmentApi from 'api/departmentApi';

ModalEditDepartment.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshDepartmentList: PropTypes.func,
};

ModalEditDepartment.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshDepartmentList: null,
};

function ModalEditDepartment(props) {
  const { editDepartmentId } = useSelector((state) => state.department);
  const { openModal, toggleShowModal, refreshDepartmentList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editDepartment, setEditDepartment] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editDepartmentId) {
          const data = (await departmentApi.getById(editDepartmentId)).data;
          setEditDepartment({
            departmentId: data.id,
            name: data.name,
            shortName: data.shortName,
            managerEId: data.managerEId ? data.managerEId : '',
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editDepartmentId]);

  const handleEditDepartment = async (values) => {
    try {
      setConfirmLoading(true);
      const response = await departmentApi.update(values);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshDepartmentList();
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
        title="Edit Department"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
      >
        {!_.isEmpty(editDepartment) && (
          <DepartmentForm
            onCancel={handleCancel}
            onSubmit={handleEditDepartment}
            loading={confirmLoading}
            initialValues={editDepartment}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditDepartment;
