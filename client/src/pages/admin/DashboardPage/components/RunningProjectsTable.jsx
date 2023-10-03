
import { Card, Table, Tag, Typography } from "antd";
const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (_, { status }) => (
      <>
        {status.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];
const data = [
  {
    key: "1",
    title: "John Brown",
    startDate: "2-1-2022",
    endDate: "2-2-2022",
    status: ["nice", "developer"],
  },
  {
    key: "2",
    title: "Jim Green",
    startDate: "1-3-2022",
    endDate: "15-4-2022",
    status: ["loser"],
  },
  {
    key: "3",
    title: "Joe Black",
    startDate: "10-2-2022",
    endDate: "20-3-2022",
    status: ["cool", "teacher"],
  },
];
function RunningProjectsTable() {
  return (
    <Card>
      <Table
        title={() => (
          <Typography.Title level={3} style={{ margin: 0 }}>
            Running Projects
          </Typography.Title>
        )}
        columns={columns}
        dataSource={data}
        scroll={{ y: 500 }}
        pagination={false}
      />
    </Card>
  );
}
export default RunningProjectsTable;
