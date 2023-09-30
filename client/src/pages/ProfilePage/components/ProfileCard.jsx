import React from "react";
import { Card, List, Typography } from "antd";
import UploadAvatar from "./UploadAvatar";
import { useSelector } from "react-redux";
import { getFullDate } from "utils/handleDate";

const { Meta } = Card;

const createData = (user) => [
  { title: "Status", content: user.isActived ? "Actived" : "Not actived" },
  {
    title: "Username",
    content: user.username,
  },
  { title: "Office", content: user.officeData?.name},
  {
    title: "Department",
    content: user.departmentData?.name,
  },
  {
    title: "Date of Job",
    content: getFullDate(user.profile.hireDate),
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
        title={`${profile.firstName} ${profile.lastName}`}
        description={profile.positionData.name}
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
