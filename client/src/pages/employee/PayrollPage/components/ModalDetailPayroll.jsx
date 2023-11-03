import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import payrollApi from 'api/payrollApi';
import { getMonthName } from 'utils/handleDate';
import { getFullDate } from 'utils/handleDate';
import { numberWithDot } from 'utils/format';

ModalDetailPayroll.propTypes = {
  openModal: PropTypes.bool,
  toggleShowModal: PropTypes.func,
};

ModalDetailPayroll.defaultProps = {
  openModal: false,
  toggleShowModal: null,
};

const createItems = (data) => [
  {
    key: '1',
    label: 'Payroll Id',
    children: data.id,
  },
  {
    key: '2',
    label: 'Month',
    children: getMonthName(data.month),
  },
  {
    key: '3',
    label: 'Employee Name',
    children: data.employeeData.firstName
      ? `${data.employeeData.firstName} ${data.employeeData.lastName}`
      : '',
    span: 2,
  },
  {
    key: '5',
    label: 'Start Date',
    children: getFullDate(data.startDate),
  },
  {
    key: '6',
    label: 'End Date',
    children: getFullDate(data.endDate),
  },
  {
    key: '11',
    label: 'Hours Worked',
    children: `${data.hoursWorked} hrs`,
  },
  {
    key: '11',
    label: 'Hours Overtime',
    children: `${data.hoursOvertime} hrs`,
  },
  {
    key: '4',
    label: 'Basic Hourly Salary',
    children: `${numberWithDot(data.salaryData.basicHourlySalary)} VNĐ/hr`,
    span: 2,
  },
  {
    key: '4',
    label: 'Hourly Overtime Salary',
    children: `${numberWithDot(data.salaryData.hourlyOvertimeSalary)} VNĐ/hr`,
    span: 2,
  },
  {
    key: '4',
    label: 'Allowance',
    children: `+ ${numberWithDot(data.salaryData.allowance)} VNĐ`,
    span: 2,
  },
  {
    key: '4',
    label: 'Deduction',
    children: `- ${numberWithDot(data.deduction)} VNĐ`,
    span: 2,
  },
  {
    key: '4',
    label: 'Total Paid',
    children: `${numberWithDot(data.totalPaid)} VNĐ`,
    span: 2,
  },
  {
    key: '5',
    label: 'Pay Date',
    children: data.payDate ? getFullDate(data.payDate) : '',
  },
  {
    key: '10',
    label: 'Status',
    children: (
      <span
        style={{
          color: data.status === 'Paid' ? 'green' : '',
        }}
      >
        {data.status}
      </span>
    ),
  },
  {
    key: '13',
    label: 'Admin Name',
    children: data.handlerData.firstName
      ? `${data.handlerData.firstName} ${data.handlerData.lastName}`
      : '',
    span: 2,
  },
];

function ModalDetailPayroll(props) {
  const { editPayrollId } = useSelector((state) => state.payroll);
  const { openModal, toggleShowModal } = props;
  const [infoPayroll, setInfoPayroll] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        if (editPayrollId) {
          const data = (await payrollApi.getById(editPayrollId)).data;
          setInfoPayroll(data);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [editPayrollId]);

  const handleCancel = () => {
    toggleShowModal();
  };

  const items = infoPayroll ? createItems(infoPayroll) : [];

  return (
    <>
      <Modal
        title="Detail Payroll"
        open={openModal}
        onCancel={handleCancel}
        footer={null}
        width={'100vh'}
      >
        <Descriptions layout="horizontal" bordered column={2} items={items} />
      </Modal>
    </>
  );
}
export default ModalDetailPayroll;
