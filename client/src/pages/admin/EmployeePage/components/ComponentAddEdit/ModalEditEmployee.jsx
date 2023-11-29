import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import EmployeeForm from './EmployeeForm';
import employeeApi from 'api/employeeApi';
import dayjs from 'dayjs';

ModalEditEmployee.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
  refreshEmployeeList: PropTypes.func,
};

ModalEditEmployee.defaultProps = {
  openModal: false,
  toggleShowModal: null,
  refreshEmployeeList: null,
};

function ModalEditEmployee(props) {
  const { editEmployeeId } = useSelector((state) => state.employee);
  const { openModal, toggleShowModal, refreshEmployeeList } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editEmployee, setEditEmployee] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editEmployeeId) {
          const data = (await employeeApi.getById(editEmployeeId)).data;
          setEditEmployee({
            employeeId: data.id,
            departmentId: data.departmentId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            citizenshipId: data.citizenshipId,
            gender: !!data.gender,
            address: data.address,
            dateBirth: dayjs(data.dateBirth),
            dateHired: dayjs(data.dateHired),
            dateOff: data.dateOff ? dayjs(data.dateOff) : null,
            avatar: data.avatarUrl,
            positionId: data.positionId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editEmployeeId]);

  const handleEditEmployee = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await employeeApi.update(data);
      Swal.fire({
        icon: 'success',
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: 'Done',
      }).then(async (result) => {
        await refreshEmployeeList();
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
        title="Edit Employee"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'150vh'}
        style={{ top: 30 }}
      >
        {!_.isEmpty(editEmployee) && (
          <EmployeeForm
            onCancel={handleCancel}
            onSubmit={handleEditEmployee}
            loading={confirmLoading}
            initialValues={editEmployee}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditEmployee;
