import {
  FireOutlined,
  IdcardOutlined,
  TeamOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import React from "react";
import LinkIconCard from "./components/LinkIconCard";
import QualityCard from "./components/QualityCard";
import RunningProjectsTable from "./components/RunningProjectsTable";
import { geekblue, green, purple, red } from "@ant-design/colors";

const iconStyle = { fontSize: 40, color: "white" };

function DashboardPage() {
  return (
    <Row gutter={[16, 24]}>
      <Col className="gutter-row" span={6} key="employees">
        <LinkIconCard
          link={"/admin/employee"}
          Icon={<TeamOutlined style={iconStyle} />}
          iconColor={purple[5]}
          title={"10 Employees"}
        />
      </Col>
      <Col className="gutter-row" span={6} key="users-active">
        <LinkIconCard
          link={"/admin/user"}
          Icon={<IdcardOutlined style={iconStyle} />}
          iconColor={geekblue[5]}
          title={"10 Users Active"}
        />
      </Col>
      <Col className="gutter-row" span={6} key="projects">
        <LinkIconCard
          link={"/admin/user"}
          Icon={<FireOutlined style={iconStyle} />}
          iconColor={green[5]}
          title={"5 Projects"}
        />
      </Col>
      <Col className="gutter-row" span={6} key="leaves">
        <LinkIconCard
          link={"/admin/user"}
          Icon={<UserDeleteOutlined style={iconStyle} />}
          iconColor={red[5]}
          title={"0 Leaves"}
        />
      </Col>

      <Col className="gutter-row" span={6}>
        <QualityCard
          backgroundColor={purple[5]}
          quality={3}
          content={"Former Employees"}
        />
      </Col>
      <Col className="gutter-row" span={6}>
        <QualityCard
          backgroundColor={geekblue[5]}
          quality={10}
          content={"Pending Leave Application"}
        />
      </Col>
      <Col className="gutter-row" span={6}>
        <QualityCard
          backgroundColor={green[5]}
          quality={10}
          content={"Pending Leave Application"}
        />
      </Col>
      <Col className="gutter-row" span={6}>
        <QualityCard
          backgroundColor={red[5]}
          quality={10}
          content={"Pending Leave Application"}
        />
      </Col>
      <Col className="gutter-row" span={14}>
        <RunningProjectsTable/>
      </Col>
      <Col className="gutter-row" span={10}>Col-10</Col>
    </Row>
  );
}

export default DashboardPage;
