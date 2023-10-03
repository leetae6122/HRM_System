import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setDefaultFilterData } from "reducers/salary";
import { toast } from "react-toastify";
import _ from "lodash";
import SalaryForm from "./SalaryForm";
import salaryApi from "api/salaryApi";

ModalEditSalary.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalEditSalary.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

function ModalEditSalary(props) {
  const dispatch = useDispatch();
  const { editSalaryId } = useSelector((state) => state.salary);
  const { openModal, toggleShowModal } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editSalary, setEditSalary] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editSalaryId) {
          const data = (await salaryApi.getById(editSalaryId)).data;
          setEditSalary({
            salaryId: data.id,
            basicSalary: data.basicSalary,
            allowance: data.allowance,
            totalSalary: data.totalSalary,
            currencyId: data.currencyId,
            employeeId: data.employeeId,
          });
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editSalaryId]);

  const handleEditSalary = async (values) => {
    try {
      setConfirmLoading(true);
      const data = _.omitBy(values, _.isNil);
      const response = await salaryApi.update(data);
      Swal.fire({
        icon: "success",
        title: response.message,
        showConfirmButton: true,
        confirmButtonText: "Done",
      }).then((result) => {
        dispatch(setDefaultFilterData());
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
        title="Edit Salary"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
      >
        {!_.isEmpty(editSalary) && (
          <SalaryForm
            onCancel={handleCancel}
            onSubmit={handleEditSalary}
            loading={confirmLoading}
            initialValues={editSalary}
          />
        )}
      </Modal>
    </>
  );
}
export default ModalEditSalary;