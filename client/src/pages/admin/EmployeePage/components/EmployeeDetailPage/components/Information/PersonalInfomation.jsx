import { Button, Card, Col, Descriptions, Row } from "antd";
import { getFullDate } from "utils/handleDate";
import { EditFilled } from "@ant-design/icons";
import PropTypes from "prop-types";

const labelStyle = {
  fontWeight: "bold",
  color: "grey",
};
const createItems = (employee) => [
  {
    key: "1",
    label: <span style={labelStyle}>First Name</span>,
    children: employee.firstName,
  },
  {
    key: "2",
    label: <span style={labelStyle}>Last Name</span>,
    children: employee.lastName,
  },
  {
    key: "3",
    label: <span style={labelStyle}>Phone</span>,
    children: employee.phoneNumber,
  },

  {
    key: "4",
    label: <span style={labelStyle}>Email</span>,
    children: employee.email,
  },
  {
    key: "5",
    label: <span style={labelStyle}>Sex</span>,
    children: employee.gender ? "Male" : "Female",
  },
  {
    key: "6",
    label: <span style={labelStyle}>Date of Birth</span>,
    children: getFullDate(employee.dateBirth),
  },
  {
    key: "7",
    label: <span style={labelStyle}>Citizenship ID</span>,
    children: employee.citizenshipId,
    span: 2,
  },
  {
    key: "8",
    label: <span style={labelStyle}>Address</span>,
    children: employee.address,
    span: 2
  },
];

PersonalInformation.propTypes = {
  employee: PropTypes.object,
  toggleModalEditEmployee: PropTypes.func,
  loading: PropTypes.bool
};

PersonalInformation.defaultProps = {
  employee: {},
  toggleModalEditEmployee: null,
  loading: false
};

function PersonalInformation(props) {
  const { employee, toggleModalEditEmployee, loading } = props;
  const items = createItems(employee);

  const Title = () => (
    <Row>
      <Col span={12}>
        <h2>Personal Information</h2>
      </Col>
      <Col span={12}>
        <Button
          style={{ float: "right" }}
          type="primary"
          icon={<EditFilled />}
          onClick={() => toggleModalEditEmployee(employee.id)}
        >
          Edit
        </Button>
      </Col>
    </Row>
  );
  return (
    <>
      <Card loading={loading}>
        <Descriptions
          layout="horizontal"
          title={<Title />}
          column={2}
          items={items}
        />
      </Card>
    </>
  );
}
export default PersonalInformation;
