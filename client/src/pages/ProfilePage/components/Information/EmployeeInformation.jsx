import { Card, Descriptions } from 'antd';
import { useSelector } from 'react-redux';
import { getFullDate } from 'utils/handleDate';

const labelStyle = {
  fontWeight: 'bold',
  color: 'grey',
};
const createItems = (profile, department, wage, position) => [
  {
    key: '1',
    label: <span style={labelStyle}>Employee Id</span>,
    children: profile.id,
  },
  {
    key: '2',
    label: <span style={labelStyle}>Date Hired</span>,
    children: getFullDate(profile.dateHired),
  },
  {
    key: '3',
    label: <span style={labelStyle}>Department Manager</span>,
    children: department.managerData?.firstName
      ? `${department.managerData.firstName} ${department.managerData.lastName}`
      : '',
  },
  {
    key: '4',
    label: <span style={labelStyle}>Department</span>,
    children: department?.name,
  },
  {
    key: '5',
    label: <span style={labelStyle}>Position</span>,
    children: position.name,
    span: 2,
  },
];

function EmployeeInformation() {
  const { user } = useSelector((state) => state.auth);

  const items = createItems(
    user.profile,
    user.profile.departmentData,
    user.profile.wageData,
    user.profile.positionData,
  );
  return (
    <>
      <Card>
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
