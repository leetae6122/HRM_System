
import { Card, List, Typography } from "antd";
import { useSelector } from "react-redux";
import { getFullDate } from "utils/handleDate";
import UploadAvatar from "./UploadAvatar";

const { Meta } = Card;

const createData = (user) => [
  { title: "Status", content: user.isActived ? "Actived" : "Not actived" },
  {
    title: "Username",
    content: user.username,
  },
  { title: "Office", content: user.officeData?.name },
  {
    title: "Department",
    content: user.departmentData?.name,
  },
  {
    title: "Date of Job",
    content: getFullDate(user.profile.dateHired),
  },
];

function ProfileCard() {
  const { user } = useSelector((state) => state.auth);
  const { profile } = user;

  const data = createData(user);

  return (
    <Card
      style={{
        display: "block",
      }}
    >
      <UploadAvatar />
      <Meta
        title={
          <Typography.Title level={3}>
            {profile.firstName} {profile.lastName}
          </Typography.Title>
        }
        description={
          <span style={{ fontSize: 16 }}>{profile.positionData.name}</span>
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
