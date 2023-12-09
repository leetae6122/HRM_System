import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import leaveApi from 'api/leaveApi';
import EditLeaveForm from './EditLeaveForm';

ModalEditLeave.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshLeaveList: PropTypes.func,
};

ModalEditLeave.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshLeaveList: null,
};

function ModalEditLeave(props) {
  const { editLeaveId } = useSelector((state) => state.leave);
  const { openModal, toggleShowModal, refreshLeaveList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [infoLeave, setInfoLeave] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editLeaveId) {
          const data = (await leaveApi.getById(editLeaveId)).data;
          setInfoLeave({
            leaveId: data.id,
            title: data.title,
            description: data.description,
            leaveFrom: data.leaveFrom,
            leaveTo: data.leaveTo,
            status: data.status,
            employeeData: data.employeeData,
            handlerData: data.handlerData
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editLeaveId]);

  const handleEditLeave = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        leaveId: editLeaveId,
        status: values.status,
        reasonRejection: values.reasonRejection,
      };
      const response = await leaveApi.adminUpdate(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshLeaveList();
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
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{
          top: 40
        }}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
      >
        {!_.isEmpty(infoLeave) && (
          <EditLeaveForm
            onCancel={handleCancel}
            onSubmit={handleEditLeave}
            loading={confirmLoading}
            infoLeave={infoLeave}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditLeave;
