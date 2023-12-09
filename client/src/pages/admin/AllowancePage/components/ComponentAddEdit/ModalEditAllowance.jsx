import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import AllowanceForm from './AllowanceForm';
import allowanceApi from 'api/allowanceApi';
import dayjs from 'dayjs';

ModalEditAllowance.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshAllowanceList: PropTypes.func,
};

ModalEditAllowance.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshAllowanceList: null,
};

function ModalEditAllowance(props) {
  const { editAllowanceId } = useSelector((state) => state.allowance);
  const { openModal, toggleShowModal, refreshAllowanceList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editAllowance, setEditAllowance] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editAllowanceId) {
          const data = (await allowanceApi.getById(editAllowanceId)).data;
          setEditAllowance({
            allowanceId: data.id,
            title: data.title,
            amount: data.amount,
            timeApplication:[dayjs(data.startDate), dayjs(data.endDate)],
            employeeId: data.employeeId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editAllowanceId]);

  const handleEditAllowance = async (values) => {
    try {
      setConfirmLoading(true);
      const data = {
        allowanceId: values.allowanceId,
        title: values.title,
        amount: values.amount,
        employeeId: values.employeeId,
        startDate: values.timeApplication[0].startOf('month'),
        endDate: values.timeApplication[1].endOf('month'),
      };
      const response = await allowanceApi.update(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshAllowanceList();
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
        title="Edit Allowance"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{ top: 60 }}
        maskClosable={!confirmLoading}
        closable={!confirmLoading}
      >
        {!_.isEmpty(editAllowance) && (
          <AllowanceForm
            onCancel={handleCancel}
            onSubmit={handleEditAllowance}
            loading={confirmLoading}
            initialValues={editAllowance}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditAllowance;
