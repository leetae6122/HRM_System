import React from "react";
import { Button, Card, Col, Descriptions, Row } from "antd";
import { useSelector } from "react-redux";
import { getFullDate } from "utils/handleDate";
import { EditFilled } from "@ant-design/icons";

const labelStyle = {
  fontWeight: "bold",
  color: "grey",
};
const createItems = (user) => [
  {
    key: "1",
    label: <span style={labelStyle}>First Name</span>,
    children: user.profile.firstName,
  },
  {
    key: "2",
    label: <span style={labelStyle}>Last Name</span>,
    children: user.profile.lastName,
  },
  {
    key: "3",
    label: <span style={labelStyle}>Phone</span>,
    children: user.profile.phoneNumber,
  },

  {
    key: "4",
    label: <span style={labelStyle}>Email</span>,
    children: user.profile.email,
  },
  {
    key: "5",
    label: <span style={labelStyle}>Sex</span>,
    children: user.profile.gender ? "Male" : "Female",
  },
  {
    key: "6",
    label: <span style={labelStyle}>Date of Birth</span>,
    children: getFullDate(user.profile.dateBirth),
  },
  {
    key: "7",
    span: 2,
    label: <span style={labelStyle}>Address</span>,
    children: user.profile.address,
  },
];

function PersonalInformation() {
  const { user } = useSelector((state) => state.auth);
  const items = createItems(user);

  const Title = () => (
    <Row>
      <Col span={12}>
        <h2>Personal Information</h2>
      </Col>
      <Col span={12}>
        <Button style={{ float: "right" }} type="primary" icon={<EditFilled />}>
          Edit
        </Button>
      </Col>
    </Row>
  );
  return (
    <>
      <Card>
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
