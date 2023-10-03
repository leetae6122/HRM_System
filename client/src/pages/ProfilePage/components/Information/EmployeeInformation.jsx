
import { Card, Descriptions } from "antd";
import { useSelector } from "react-redux";
import { getFullDate } from "utils/handleDate";
import { numberWithDot } from "utils/format";

const labelStyle = {
  fontWeight: "bold",
  color: "grey",
};
const createItems = (profile, department, office, salary, position) => [
  {
    key: "1",
    label: <span style={labelStyle}>Employee Id</span>,
    children: profile.id,
  },
  {
    key: "2",
    label: <span style={labelStyle}>Date Hired</span>,
    children: getFullDate(profile.dateHired),
  },
  {
    key: "3",
    label: <span style={labelStyle}>Department</span>,
    children: department?.name,
  },
  {
    key: "4",
    label: <span style={labelStyle}>Position</span>,
    children: position.name,
  },
  {
    key: "5",
    label: <span style={labelStyle}>Salary</span>,
    children: `${numberWithDot(salary.totalSalary)} ${salary.currencyData.code}`,
  },
  {
    key: "6",
    label: <span style={labelStyle}>Office</span>,
    children: office?.title,
  },
  {
    key: "7",
    label: <span style={labelStyle}>Office Location</span>,
    span: 2,
    children: office
      ? `${office.streetAddress}, ${office.city}, ${office.stateProvince}`
      : "",
  },
];

function EmployeeInformation() {
  const { user } = useSelector((state) => state.auth);
  const items = createItems(
    user.profile,
    user.profile.departmentData,
    user.profile.officeData,
    user.profile.salaryData,
    user.profile.positionData
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
