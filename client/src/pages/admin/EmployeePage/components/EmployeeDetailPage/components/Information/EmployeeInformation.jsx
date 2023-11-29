import { Card, Descriptions } from 'antd';
import { getFullDate } from 'utils/handleDate';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import relativeTime from 'dayjs/plugin/relativeTime';
import { calcDate } from 'utils/handleDate';

dayjs.extend(relativeTime);

const labelStyle = {
  fontWeight: 'bold',
  color: 'grey',
};
const createItems = (employee) => [
  {
    key: '1',
    label: <span style={labelStyle}>Employee Id</span>,
    children: employee.id,
    span: 2,
  },
  {
    key: '2',
    label: <span style={labelStyle}>Date Hired</span>,
    children: `${getFullDate(employee.dateHired)} ( ${calcDate(
      employee.dateHired,
      employee.dateOff ? dayjs(employee.dateOff) : dayjs(),
    )} )`,
    span: 2,
  },
  {
    key: '3',
    label: <span style={labelStyle}>Days off work</span>,
    children: employee.dateOff ? getFullDate(employee.dateOff) : '',
    span: 2,
  },
  {
    key: '4',
    label: <span style={labelStyle}>Department Manager</span>,
    children: employee.departmentData.managerData?.firstName
      ? `#${employee.departmentData.managerData.id} - ${employee.departmentData.managerData.lastName} ${employee.departmentData.managerData.firstName}`
      : '',
    span: 2,
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
