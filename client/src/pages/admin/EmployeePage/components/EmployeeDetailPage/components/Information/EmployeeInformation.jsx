import React from "react";
import { Card, Descriptions } from "antd";
import { getFullDate } from "utils/handleDate";
import { numberWithDot } from "utils/format";

const labelStyle = {
  fontWeight: "bold",
  color: "grey",
};
const createItems = (employee) => [
  {
    key: "1",
    label: <span style={labelStyle}>Employee Id</span>,
    children: employee.id,
  },
  {
    key: "2",
    label: <span style={labelStyle}>Date Hired</span>,
    children: getFullDate(employee.dateHired),
  },
  {
    key: "3",
    label: <span style={labelStyle}>Department</span>,
    children: employee.departmentData?.name,
  },
  {
    key: "4",
    label: <span style={labelStyle}>Position</span>,
    children: employee.positionData.name,
  },
  {
    key: "5",
    label: <span style={labelStyle}>Office</span>,
    children: employee.officeData?.title,
  },
  {
    key: "6",
    label: <span style={labelStyle}>Office Location</span>,
    children: employee.officeData
      ? `${employee.officeData.streetAddress}, ${employee.officeData.city}, ${employee.officeData.stateProvince}`
      : "",
  },
  {
    key: "7",
    label: <span style={labelStyle}>Salary</span>,
    children: employee.salaryData
      ? `${numberWithDot(employee.salaryData.totalSalary)} ${
          employee.salaryData.currencyData.code
        }`
      : "",
  },
];

function EmployeeInformation(props) {
  const { employee, loading } = props;
  const items = createItems(employee);

  return (
    <>
      <Card loading={loading}>
        <Descriptions
          layout="horizontal"
          title={<h3>Employee Information</h3>}
          column={1}
          items={items}
        />
      </Card>
    </>
  );
}
export default EmployeeInformation;
