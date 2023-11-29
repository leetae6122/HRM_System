import { Card, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { calcDate } from 'utils/handleDate';
import { getFullDate } from 'utils/handleDate';

const labelStyle = {
  fontWeight: 'bold',
  color: 'grey',
};
const createItems = (profile, department, position) => [
  {
    key: '1',
    label: <span style={labelStyle}>Employee Id</span>,
    children: profile.id,
    span: 2,
  },
  {
    key: '2',
    label: <span style={labelStyle}>Date Hired</span>,
    children: `${getFullDate(profile.dateHired)} ( ${calcDate(
      profile.dateHired,
      profile.dateOff ? dayjs(profile.dateOff) : dayjs(),
    )} )`,
    span: 2,
  },
  {
    key: '3',
    label: <span style={labelStyle}>Department Manager</span>,
    children: department.managerEId
      ? `#${department.managerData.id} - ${department.managerData.lastName} ${department.managerData.firstName}`
      : '',
    span: 2,
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
  },
];

function EmployeeInformation() {
  const { user } = useSelector((state) => state.auth);

  const items = createItems(
    user.profile,
    user.profile.departmentData,
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
