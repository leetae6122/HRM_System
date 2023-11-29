import { Card, List, Typography } from "antd";
import defaultAvatar from "assets/images/avatar-user.jpg";
import PropTypes from "prop-types";

const { Meta } = Card;

const createData = (employee) => [
  {
    title: "Status",
    content: (employee.dateOff ? "Retired from work" : "Working") ?? "",
  },
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

ProfileCard.propTypes = {
  employee: PropTypes.object,
  loading: PropTypes.bool,
};

ProfileCard.defaultProps = {
  employee: {},
  loading: false,
};

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
          <Typography.Title level={4}>
            {employee.lastName} {employee.firstName}
          </Typography.Title>
        }
        description={
          <span style={{ fontSize: 15 }}>{employee.positionData.name}</span>
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
