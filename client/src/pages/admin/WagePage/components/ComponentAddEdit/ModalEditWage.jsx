import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import WageForm from './WageForm';
import wageApi from 'api/wageApi';
import dayjs from 'dayjs';

ModalEditWage.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshWageList: PropTypes.func,
};

ModalEditWage.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshWageList: null,
};

function ModalEditWage(props) {
  const { editWageId } = useSelector((state) => state.wage);
  const { openModal, toggleShowModal, refreshWageList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editWage, setEditWage] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editWageId) {
          const data = (await wageApi.getById(editWageId)).data;
          setEditWage({
            wageId: data.id,
            basicHourlyWage: data.basicHourlyWage,
            fromDate: dayjs(data.fromDate),
            toDate: data.toDate ? dayjs(data.toDate) : '',
            employeeId: data.employeeId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editWageId]);

  const handleEditWage = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, value => _.isString(value) && _.isEmpty(value));
      const response = await wageApi.update(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshWageList();
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
        title="Edit Wage"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
        style={{ top: 60 }}
      >
        {!_.isEmpty(editWage) && (
          <WageForm
            onCancel={handleCancel}
            onSubmit={handleEditWage}
            loading={confirmLoading}
            initialValues={editWage}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditWage;
