import { Card, Descriptions } from 'antd';
import { getFullDate } from 'utils/handleDate';
import { numberWithDot } from 'utils/format';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import relativeTime from 'dayjs/plugin/relativeTime';
import { now } from 'lodash';
import { calcDate } from 'utils/handleDate';

dayjs.extend(relativeTime);

const labelStyle = {
  fontWeight: 'bold',
  color: 'grey',
};
const createItems = (employee, department) => [
  {
    key: '1',
    label: <span style={labelStyle}>Employee Id</span>,
    children: employee.id,
    span: 2
  },
  {
    key: '2',
    label: <span style={labelStyle}>Date Hired</span>,
    children: `${getFullDate(employee.dateHired)} ( ${calcDate(
      employee.dateHired,
      now(),
    )} )`,
  },
  {
    key: '3',
    label: <span style={labelStyle}>Days off work</span>,
    children: employee.dateOff ? getFullDate(employee.dateOff) : '',
  },
  {
    key: '4',
    label: <span style={labelStyle}>Manger</span>,
    children: employee.managerId
      ? `${employee.managerData.firstName} ${employee.managerData.lastName}`
      : '',
  },
  {
    key: '5',
    label: <span style={labelStyle}>Department</span>,
    children: employee.departmentData?.name,
  },
  {
    key: '6',
    label: <span style={labelStyle}>Position</span>,
    children: employee.positionData.name,
  },
  {
    key: '7',
    label: <span style={labelStyle}>Salary</span>,
    children: employee.salaryData.totalSalary
      ? `${numberWithDot(employee.salaryData.totalSalary)} ${
          employee.salaryData.currencyData.code
        }`
      : '',
  },
  {
    key: '8',
    label: <span style={labelStyle}>Office</span>,
    children: department ? department.officeData.title : '',
    span: 2
  },
  {
    key: '9',
    label: <span style={labelStyle}>Office Location</span>,
    children: `${department.officeData.streetAddress}${
      department.officeData.stateProvince
        ? `, ${department.officeData.stateProvince}`
        : ''
    }, ${department.officeData.city}`,
    span: 2
  },
];

EmployeeInformation.propTypes = {
  employee: PropTypes.object,
  loading: PropTypes.bool,
};

EmployeeInformation.defaultProps = {
  employee: {},
  loading: false,
};

function EmployeeInformation(props) {
  const { employee, loading } = props;
  const items = createItems(employee, employee.departmentData);
  return (
    <>
      <Card loading={loading}>
        <Descriptions
          layout="horizontal"
          title={<h3>Employee Information</h3>}
          column={2}
          items={items}
        />
      </Card>
    </>
  );
}
export default EmployeeInformation;
