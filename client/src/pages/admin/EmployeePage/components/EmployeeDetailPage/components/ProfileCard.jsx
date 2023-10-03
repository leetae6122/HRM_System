
import { Card, List, Typography } from "antd";
import defaultAvatar from "assets/images/avatar-user.jpg";

const { Meta } = Card;

const createData = (employee) => [
  // {
  //   title: "Status",
  //   content: (employee.userData.isActived ? "Actived" : "Not actived") ?? "",
  // },
  {
    title: "Username",
    content: employee.userData?.username ?? "",
  },
  { title: "Email", content: employee?.email },
  {
    title: "Phone Number",
    content: employee?.phoneNumber,
  },
];

function ProfileCard(props) {
  const { employee, loading } = props;

  const data = createData(employee);

  return (
    <Card
      style={{
        display: "block",
      }}
      loading={loading}
    >
      <img
        src={employee.avatarUrl ?? defaultAvatar}
        alt="avatar"
        style={{
          width: "100%",
          border: "1px solid #a1a1a1",
          borderRadius: 5,
        }}
      />
      <Meta
        title={
          <Typography.Title level={3}>
            {employee.firstName} {employee.lastName}
          </Typography.Title>
        }
        description={
          <span style={{ fontSize: 16 }}>{employee.positionData.name}</span>
        }
        style={{ textAlign: "center" }}
      />
      <hr style={{ borderTop: "1px solid #ccc" }} />
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Title level={5}>{item.title}:</Typography.Title>
            {item.content}
          </List.Item>
        )}
      />
    </Card>
  );
}
export default ProfileCard;
