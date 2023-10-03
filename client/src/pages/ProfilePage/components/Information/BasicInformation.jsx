
import { Card, Descriptions } from "antd";
import { useSelector } from "react-redux";

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
    label: <span style={labelStyle}>Gender</span>,
    children: user.profile.gender ? "Man" : "Woman",
  },
];

function BasicInformation() {
  const { user } = useSelector((state) => state.auth);
  const items = createItems(user);

  return (
    <>
      <Card>
        <Descriptions
          layout="horizontal"
          title={<h3>Basic Information</h3>}
          column={2}
          items={items}
        />
      </Card>
    </>
  );
}
export default BasicInformation;
